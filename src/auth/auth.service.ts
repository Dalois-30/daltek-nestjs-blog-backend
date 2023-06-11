import {
  Injectable,
  UnauthorizedException,
  HttpStatus,
  HttpException,
  Logger,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { Repository } from 'typeorm';
import { EmailVerificationEntity } from './entities/emailverification.entity';
import { InjectRepository } from '@nestjs/typeorm';
import 'dotenv/config';
import { transporter } from './constant/email-constants';
import { UserRoles } from './constant/user-roles';
import { CreateUserDto, ResetPassWordDto } from './dto/create-user.dto';
import { LoginUserDto, VerifyOtpDto } from './dto/login-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UsersService } from 'src/features/users/users.service';
import { JwtPayloadService } from './jwt.payload.service';
import { Request as RequestExpress, Response } from 'express';
import * as OtpGenerator from 'otp-generator';
import { ApiResponseDTO } from 'src/shared/response/api-response';

const phoneRegex = /^6(?=[579])([0-9]{8})/;

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private readonly jwtPayloadService: JwtPayloadService,
    @InjectRepository(EmailVerificationEntity)
    private readonly emailVerificationRepository: Repository<EmailVerificationEntity>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }

  /**
   * 
   * @param createUserDto create user dto
   * @returns the created user
   */
  async create(createUserDto: CreateUserDto, response: Response) {
    const res = new ApiResponseDTO<User>();
    try {
      // check if user already exists
      const user = await this.usersService.findOneByEmail(createUserDto.email);

      if (user) {
        throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
      }

      const userName = await this.userRepository.findOneBy({username: createUserDto.username})
      if(userName) {
        throw new HttpException('username already exists', HttpStatus.CONFLICT)
      }
      // create new user
      const newUser = new User();
      newUser.email = createUserDto.email;
      newUser.password = createUserDto.password;
      newUser.username = createUserDto.username;
      newUser.role = UserRoles.USER;

      const userResponse = await this.userRepository.save(newUser);
      await this.createEmailToken(newUser.email, response)
      // set the response object
      res.data = userResponse;
      res.statusCode = HttpStatus.CREATED;
      res.message = "user created successfully"
    } catch (error) {
      res.statusCode = HttpStatus.BAD_REQUEST;
      res.message = error.message
    }
    // return the response
    return response.send(res);

  }
/**
 * 
 * @param createUserDto create user dto
 * @returns the admin user object
 */
  async createAdmin(createUserDto: CreateUserDto, response: Response) {
    const res = new ApiResponseDTO<User>();
    try {
      const user = await this.usersService.findOneByEmail(createUserDto.email);
      if (user) {
        throw new HttpException('User already exists', HttpStatus.CONFLICT);
      }

      const userName = await this.userRepository.findOneBy({username: createUserDto.username})
      if(userName) {
        throw new HttpException('username already exists', HttpStatus.CONFLICT)
      }
  
      const newUser = new User();
      newUser.email = createUserDto.email;
      newUser.password = createUserDto.password;
      newUser.username = createUserDto.username;
      newUser.role = UserRoles.ADMIN;
  
      const userResponse = await this.userRepository.save(newUser);
      await this.createEmailToken(newUser.email, response)
      // set the response object
      res.data = userResponse;
      res.statusCode = HttpStatus.CREATED;
      res.message = "user created successfully"
    } catch (error) {
      res.statusCode = HttpStatus.BAD_REQUEST;
      res.message = error.message
    }
    // return response
    return response.send(res);
  }

  /**
   * 
   * @param userId the user id
   * @param resetPassWord dto containing the password reset
   * @returns successful message
   */
  async resetPassword(email: string, resetPassWord: ResetPassWordDto) {
    const res = new ApiResponseDTO<User>();
    try {
      // check if user exists
      const user = await this.userRepository.findOneBy({
        email: email,
      });
      if (!user) {
        throw new UnauthorizedException('User does not exist');
      }
      const state = await this.checkPassword(resetPassWord.actualPassword, user);
      if (state) {
        const newUser = new UpdateUserDto();
        newUser.password = resetPassWord.newPassword;
        this.userRepository.merge(user, newUser);
        await this.userRepository.save(user);
        res.message = "Successful Updated";
        res.statusCode = HttpStatus.OK;
      } else {
        throw new HttpException('Wrong credentials', HttpStatus.UNAUTHORIZED);
      }
    } catch (error) {
      res.statusCode = HttpStatus.BAD_REQUEST;
      res.message = error.message     
    }
    return res;
  }
/**
 * 
 * @param loginUserDto the credentials of user
 * @returns the user object
 */
  async validateUserByPassword(loginUserDto: LoginUserDto) {
    const res = new ApiResponseDTO<any>();
    try {
      const user = await this.usersService.findOneByEmail(loginUserDto.email);
      if (!user) {
        throw new UnauthorizedException('User does not exist');
      }
      // check password
      const promise: any = await new Promise(async resolve => {
        const state = await this.checkPassword(loginUserDto.password, user);
        if (state) {
          resolve(this.jwtPayloadService.createJwtPayload(user));
        } else {
          resolve({ status: 401 });
        }
      });
  
      if (promise.status !== 401) {
        res.data = promise;
        res.message = "Success"
        res.statusCode = HttpStatus.OK;
      } else {
        throw new HttpException('Wrong credentials', HttpStatus.UNAUTHORIZED);
      }
    } catch (error) {
      res.statusCode = HttpStatus.BAD_REQUEST;
      res.message = error.message     
    }
    return res;
  }

  /**
   * 
   * @param password 
   * @param user 
   * @returns check the users credentials
   */
  async checkPassword(password: string, user: User): Promise<boolean> {
    return new Promise(async resolve => {
      await bcrypt.compare(password, user.password, async (err, isMatch) => {
        if (err) {
          return err;
        }
        resolve(isMatch);
      });
    });
  }

  /**
   * 
   * @param payload the jwt payload
   * @returns 
   */
  async validateUserByJwt(payload: JwtPayload) {
    const user = await this.usersService.findOneByEmail(payload.email);

    if (user) {
      return this.jwtPayloadService.createJwtPayload(user);
    } else {
      throw new UnauthorizedException();
    }
  }

  /**
   * create email token
   * @param email 
   * @returns 
   */
  async createEmailToken(email: string, res: Response) {

    const otp = OtpGenerator.generate(10, {
      lowerCaseAlphabets: true,
      upperCaseAlphabets: true,
      specialChars: true,
    });

    res.cookie('OTP', otp, {
      maxAge: 5 * 60 * 1000,
      httpOnly: false,
      secure: false,
    });
    const user = await this.usersService.findOneByEmail(email);
    if (!user) {
      throw new UnauthorizedException('User does not exist');
    }
      const mailOptions = {
        from: '"DalTek" <' + process.env.EMAIL_USER + '>',
        to: email,
        subject: 'Verify Email',
        text: 'Verify your Email',
        html: `Hi! <br><br> Thanks for your registration<br><br>
         <p>This is your verification code <a href=#> '${otp}' </a></p>`,
      };

      return await this.sendEmail(mailOptions);   
  }

  async verifyEmail(token: string, email: string, req: RequestExpress) {
    const otp = req.cookies['OTP'];
    if (!otp) {
      throw new HttpException(
        'token expired',
        HttpStatus.NOT_FOUND,
      );
    }
    const res = new ApiResponseDTO<string>()
    console.log(otp, token);
    if (otp !== token) {
      throw new HttpException('Otp invalide', HttpStatus.NOT_ACCEPTABLE);
    }
    const userFromDb = await this.usersService.findOneByEmail(
      email,
    );
    if (userFromDb) {
      await this.usersService.update(userFromDb.id, {
        verified: true,
      });
    }
    res.data = otp;
    res.message = "successfully verified OTP";

    return {
      res
    };
  }


  async sendEmail(mailOptions) {
    return await new Promise<{}>(async (resolve, reject) => {
      return await transporter.sendMail(mailOptions, async (error, info) => {
        if (error) {
          Logger.log(
            `Error while sending message: ${error}`,
            'sendEmailVerification',
          );
          return reject(error);
        }
        Logger.log(`Send message: ${info.messageId}`, 'sendEmailVerification');
        resolve({ message: 'Successfully send email' });
      });
    });
  }
}

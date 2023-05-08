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
import { LoginUserDto } from './dto/login-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UsersService } from 'src/features/users/users.service';
import { JwtPayloadService } from './jwt.payload.service';

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

  async create(createMarchandDto: CreateUserDto) {
    const user = await this.usersService.findOneByEmail(createMarchandDto.email);

    if (user) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }

    const newUser = new User();
    newUser.email = createMarchandDto.email;
    newUser.password = createMarchandDto.password;
    newUser.role = UserRoles.USER;

    const userResponse = await this.userRepository.save(newUser);
    const token = await this.jwtPayloadService.createJwtPayload(newUser);
    return { userResponse, token };
    
    // // create the marchand
    // const marchand = this.marchandRepository.create({
    //   name: createMarchandDto.name,
    //   address: createMarchandDto.address,
    //   tel: createMarchandDto.tel,
    //   email: createMarchandDto.email
    // });
    // // set the type and the user of the marchand object
    // marchand.user = userResponse;
    // // save the marchand
    // return await this.marchandRepository.save(marchand);
  }

  async createAdmin(createUserDto: CreateUserDto) {
    const user = await this.usersService.findOneByEmail(createUserDto.email);

    if (user) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }

    const newUser = new User();
    newUser.email = createUserDto.email;
    newUser.password = createUserDto.password;
    newUser.role = UserRoles.ADMIN;

    const userResponse = await this.userRepository.save(newUser);
    const token = await this.jwtPayloadService.createJwtPayload(newUser);

    return { userResponse, token };
  }

  async resetPassword(userId: string, resetPassWord: ResetPassWordDto){
    const user = await this.userRepository.findOneBy({
      id: userId,
    });
    if (!user) {
      throw new UnauthorizedException('User does not exist');
    }
    const state = await this.checkPassword(resetPassWord.actualPassword, user);
    if (state) { 
      const newUser = new UpdateUserDto();
      newUser.password = resetPassWord.newPassword;
      await this.userRepository.merge(user, newUser);
      return await this.userRepository.save(user);
    }else{
      throw new HttpException('Wrong credentials', HttpStatus.UNAUTHORIZED);
    }
  }

  async validateUserByPassword(loginUserDto: LoginUserDto) {
    const user = await this.usersService.findOneByEmail(loginUserDto.email);
    if (!user) {
      throw new UnauthorizedException('User does not exist');
    }

    const promise: any = await new Promise(async resolve => {
      const state = await this.checkPassword(loginUserDto.password, user);
      if (state) {
        resolve(this.jwtPayloadService.createJwtPayload(user));
      } else {
        resolve({ status: 401 });
      }
    });

    if (promise.status !== 401) {
      return promise;
    } else {
      throw new HttpException('Wrong credentials', HttpStatus.UNAUTHORIZED);
    }
  }

  async checkPassword(password: string, user): Promise<boolean> {
    return new Promise(async resolve => {
      await bcrypt.compare(password, user.password, async (err, isMatch) => {
        if (err) {
          return err;
        }
        resolve(isMatch);
      });
    });
  }

  async validateUserByJwt(payload: JwtPayload) {
    const user = await this.usersService.findOneByEmail(payload.email);

    if (user) {
      return this.jwtPayloadService.createJwtPayload(user);
    } else {
      throw new UnauthorizedException();
    }
  }

  async createEmailToken(email: string) {
    const emailVerification = await this.emailVerificationRepository.findOneBy({
      email,
    });

    if (!emailVerification) {
      const emailVerificationToken = await this.emailVerificationRepository.save(
        {
          email,
          emailToken: (
            Math.floor(Math.random() * 9000000) + 1000000
          ).toString(),
          timestamp: new Date(),
        },
      );
      return emailVerificationToken;
    }
    return false;
  }

  async verifyEmail(token: string): Promise<boolean> {
    const emailVerif = await this.emailVerificationRepository.findOneBy({
      emailToken: token,
    });
    if (emailVerif && emailVerif.email) {
      const userFromDb = await this.usersService.findOneByEmail(
        emailVerif.email,
      );
      if (userFromDb) {
        await this.usersService.update(userFromDb.id, {
          verified: true,
        });

        await this.emailVerificationRepository.delete({ emailToken: token });
        return true;
      }
    } else {
      throw new HttpException('Invalid token', HttpStatus.FORBIDDEN);
    }
  }

  async sendEmailVerification(email: string) {
    const repository = await this.emailVerificationRepository.findOneBy({
      email,
    });

    if (repository && repository.emailToken) {
      const mailOptions = {
        from: '"Mendo Cash" <' + process.env.EMAIL_USER + '>',
        to: email,
        subject: 'Verify Email',
        text: 'Verify your Email',
        html: `Hi! <br><br> Thanks for your registration<br><br>
         <p>This is your verification code <a href=#> '${repository.emailToken}' </a></p>`,
      };

      return await this.sendEmail(mailOptions);
    } else {
      throw new HttpException('User not found', HttpStatus.FORBIDDEN);
    }
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

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRoles } from 'src/auth/constant/user-roles';
import { CreateUserDto } from 'src/auth/dto/create-user.dto';
import { EmailVerificationEntity } from 'src/auth/entities/emailverification.entity';
import { User } from 'src/auth/entities/user.entity';
import { JwtPayloadService } from 'src/auth/services/jwt.payload.service';
import { ApiResponseDTO } from 'src/shared/response/api-response';
import { Repository } from 'typeorm';
import { Request as RequestExpress, Response } from 'express';
import { SharedService } from 'src/shared/services/shared.service';
import { UsersService } from 'src/features/users/services/users.service';

@Injectable()
export class AdminService {

    constructor(
        private usersService: UsersService,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly sharedService: SharedService
    ) { }

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

            const userName = await this.userRepository.findOneBy({ username: createUserDto.username })
            if (userName) {
                throw new HttpException('username already exists', HttpStatus.CONFLICT)
            }

            const newUser = new User();
            newUser.email = createUserDto.email;
            newUser.password = createUserDto.password;
            newUser.username = createUserDto.username;
            newUser.role = UserRoles.ADMIN;

            const userResponse = await this.userRepository.save(newUser);
            await this.sharedService.createEmailToken(newUser.email, response)
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
}

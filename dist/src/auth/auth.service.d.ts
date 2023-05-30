import { JwtPayload } from './interfaces/jwt-payload.interface';
import { Repository } from 'typeorm';
import { EmailVerificationEntity } from './entities/emailverification.entity';
import 'dotenv/config';
import { CreateUserDto, ResetPassWordDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { User } from './entities/user.entity';
import { UsersService } from 'src/features/users/users.service';
import { JwtPayloadService } from './jwt.payload.service';
import { Request as RequestExpress, Response } from 'express';
import { ApiResponseDTO } from 'src/shared/response/api-response';
export declare class AuthService {
    private usersService;
    private readonly jwtPayloadService;
    private readonly emailVerificationRepository;
    private readonly userRepository;
    constructor(usersService: UsersService, jwtPayloadService: JwtPayloadService, emailVerificationRepository: Repository<EmailVerificationEntity>, userRepository: Repository<User>);
    create(createUserDto: CreateUserDto, response: Response): Promise<Response<any, Record<string, any>>>;
    createAdmin(createUserDto: CreateUserDto, response: Response): Promise<Response<any, Record<string, any>>>;
    resetPassword(email: string, resetPassWord: ResetPassWordDto): Promise<ApiResponseDTO<User>>;
    validateUserByPassword(loginUserDto: LoginUserDto): Promise<ApiResponseDTO<any>>;
    checkPassword(password: string, user: User): Promise<boolean>;
    validateUserByJwt(payload: JwtPayload): Promise<{
        expiresIn: number;
        token: any;
    }>;
    createEmailToken(email: string, res: Response): Promise<{}>;
    verifyEmail(token: string, email: string, req: RequestExpress): Promise<{
        res: ApiResponseDTO<string>;
    }>;
    sendEmail(mailOptions: any): Promise<{}>;
}

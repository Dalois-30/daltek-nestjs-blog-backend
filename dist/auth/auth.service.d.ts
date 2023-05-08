import { JwtPayload } from './interfaces/jwt-payload.interface';
import { Repository } from 'typeorm';
import { EmailVerificationEntity } from './entities/emailverification.entity';
import 'dotenv/config';
import { CreateUserDto, ResetPassWordDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { User } from './entities/user.entity';
import { UsersService } from 'src/features/users/users.service';
import { JwtPayloadService } from './jwt.payload.service';
export declare class AuthService {
    private usersService;
    private readonly jwtPayloadService;
    private readonly emailVerificationRepository;
    private readonly userRepository;
    constructor(usersService: UsersService, jwtPayloadService: JwtPayloadService, emailVerificationRepository: Repository<EmailVerificationEntity>, userRepository: Repository<User>);
    create(createMarchandDto: CreateUserDto): Promise<{
        userResponse: User;
        token: {
            expiresIn: number;
            token: any;
        };
    }>;
    createAdmin(createUserDto: CreateUserDto): Promise<{
        userResponse: User;
        token: {
            expiresIn: number;
            token: any;
        };
    }>;
    resetPassword(userId: string, resetPassWord: ResetPassWordDto): Promise<User>;
    validateUserByPassword(loginUserDto: LoginUserDto): Promise<any>;
    checkPassword(password: string, user: any): Promise<boolean>;
    validateUserByJwt(payload: JwtPayload): Promise<{
        expiresIn: number;
        token: any;
    }>;
    createEmailToken(email: string): Promise<false | ({
        email: string;
        emailToken: string;
        timestamp: Date;
    } & EmailVerificationEntity)>;
    verifyEmail(token: string): Promise<boolean>;
    sendEmailVerification(email: string): Promise<{}>;
    sendEmail(mailOptions: any): Promise<{}>;
}

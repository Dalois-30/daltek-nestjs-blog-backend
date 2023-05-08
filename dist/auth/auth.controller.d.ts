import { AuthService } from './auth.service';
import { CreateUserDto, ResetPassWordDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    createUser(user: CreateUserDto): Promise<{
        userResponse: import("./entities/user.entity").User;
        token: {
            expiresIn: number;
            token: any;
        };
    }>;
    createAdmin(user: CreateUserDto): Promise<{
        userResponse: import("./entities/user.entity").User;
        token: {
            expiresIn: number;
            token: any;
        };
    }>;
    login(loginUserDto: LoginUserDto): Promise<any>;
    sendEmailVerification(email: string): Promise<{}>;
    resetPassword(id: string, resetPassDto: ResetPassWordDto): Promise<import("./entities/user.entity").User>;
    verifyEmail(token: string): Promise<{
        message: string;
    }>;
}

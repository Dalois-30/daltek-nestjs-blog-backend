import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { Repository } from 'typeorm';
import 'dotenv/config';
import { CreateUserDto, ResetPassWordDto } from '../dto/create-user.dto';
import { LoginUserDto } from '../dto/login-user.dto';
import { User } from '../entities/user.entity';
import { JwtPayloadService } from './jwt.payload.service';
import { Request as RequestExpress, Response } from 'express';
import { ApiResponseDTO } from 'src/shared/response/api-response';
import { SharedService } from 'src/shared/services/shared.service';
import { UsersService } from 'src/features/users/services/users.service';
export declare class AuthService {
    private usersService;
    private readonly jwtPayloadService;
    private readonly userRepository;
    private readonly sharedService;
    constructor(usersService: UsersService, jwtPayloadService: JwtPayloadService, userRepository: Repository<User>, sharedService: SharedService);
    create(createUserDto: CreateUserDto, response: Response): Promise<Response<any, Record<string, any>>>;
    resetPassword(email: string, resetPassWord: ResetPassWordDto): Promise<ApiResponseDTO<User>>;
    validateUserByPassword(loginUserDto: LoginUserDto): Promise<ApiResponseDTO<any>>;
    checkPassword(password: string, user: User): Promise<boolean>;
    validateUserByJwt(payload: JwtPayload): Promise<{
        expiresIn: number;
        token: any;
    }>;
    verifyEmail(token: string, email: string, req: RequestExpress): Promise<ApiResponseDTO<string>>;
}

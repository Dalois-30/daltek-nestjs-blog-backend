import { Repository } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { JwtService } from '@nestjs/jwt';
import { UpdateUserDto } from 'src/auth/dto/update-user.dto';
import { User } from 'src/auth/entities/user.entity';
import { ApiResponseDTO } from 'src/shared/response/api-response';
import { SharedService } from 'src/shared/shared.service';
export declare class UsersService {
    private readonly userRepository;
    private readonly httpService;
    private readonly jwtService;
    private sharedService;
    constructor(userRepository: Repository<User>, httpService: HttpService, jwtService: JwtService, sharedService: SharedService);
    findAll(headers: any): Promise<ApiResponseDTO<User[]>>;
    findOneById(id: string): Promise<ApiResponseDTO<User>>;
    findOneByEmail(email: string): Promise<User>;
    update(id: string, newUser: UpdateUserDto): Promise<ApiResponseDTO<User>>;
    deleteUserById(id: string): Promise<ApiResponseDTO<User>>;
    deleteAll(): Promise<void>;
}

import { CreateUserDto } from 'src/auth/dto/create-user.dto';
import { User } from 'src/auth/entities/user.entity';
import { ApiResponseDTO } from 'src/shared/response/api-response';
import { Repository } from 'typeorm';
import { Response } from 'express';
import { SharedService } from 'src/shared/services/shared.service';
import { UsersService } from 'src/features/users/services/users.service';
import { Role } from 'src/features/role/entities/role.entity';
import { CreateRoleDto } from '../dto/create-role.dto';
export declare class AdminService {
    private usersService;
    private readonly userRepository;
    private readonly roleRepository;
    private readonly sharedService;
    constructor(usersService: UsersService, userRepository: Repository<User>, roleRepository: Repository<Role>, sharedService: SharedService);
    createAdmin(createUserDto: CreateUserDto, response: Response): Promise<Response<any, Record<string, any>>>;
    createRole(createRoleDto: CreateRoleDto, response: Response): Promise<Response<any, Record<string, any>>>;
    findAll(headers: any): Promise<ApiResponseDTO<User[]>>;
    deleteUserById(id: string): Promise<ApiResponseDTO<User>>;
    deleteAll(): Promise<void>;
}

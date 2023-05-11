import { UsersService } from './users.service';
import { UpdateUserDto } from 'src/auth/dto/update-user.dto';
import { User } from 'src/auth/entities/user.entity';
import { ApiResponseDTO } from 'src/shared/response/api-response';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getAllUsers(headers: any): Promise<ApiResponseDTO<User[]>>;
    getUserByEmail(email: string): Promise<User>;
    getUserById(id: string): Promise<ApiResponseDTO<User>>;
    deleteAllUsers(): Promise<void>;
    deleteUserById(id: string): Promise<ApiResponseDTO<User>>;
    updateUser(id: string, user: UpdateUserDto): Promise<ApiResponseDTO<User>>;
    testAuthRoute(): {
        message: string;
    };
}

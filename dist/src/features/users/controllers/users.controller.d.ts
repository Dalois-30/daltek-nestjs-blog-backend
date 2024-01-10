import { UsersService } from '../services/users.service';
import { UpdateUserDto } from 'src/auth/dto/update-user.dto';
import { User } from 'src/auth/entities/user.entity';
import { ApiResponseDTO } from 'src/shared/response/api-response';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getUserByEmail(email: string): Promise<User>;
    getUserById(id: string): Promise<ApiResponseDTO<User>>;
    updateUser(id: string, user: UpdateUserDto): Promise<ApiResponseDTO<User>>;
    testAuthRoute(headers: any): {
        message: string;
    };
}

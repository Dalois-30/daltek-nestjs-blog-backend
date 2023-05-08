import { UsersService } from './users.service';
import { UpdateUserDto } from 'src/auth/dto/update-user.dto';
import { User } from 'src/auth/entities/user.entity';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getAllUsers(headers: any): Promise<User[]>;
    getUserByEmail(email: string): Promise<User>;
    getUserById(id: string): Promise<User>;
    deleteAllUsers(): Promise<void>;
    deleteUserById(id: string): Promise<import("typeorm").DeleteResult>;
    updateUser(id: string, user: UpdateUserDto): Promise<User>;
    testAuthRoute(): {
        message: string;
    };
}

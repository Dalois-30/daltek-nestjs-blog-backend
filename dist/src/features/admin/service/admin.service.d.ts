import { CreateUserDto } from 'src/auth/dto/create-user.dto';
import { User } from 'src/auth/entities/user.entity';
import { Repository } from 'typeorm';
import { Response } from 'express';
import { SharedService } from 'src/shared/services/shared.service';
import { UsersService } from 'src/features/users/services/users.service';
export declare class AdminService {
    private usersService;
    private readonly userRepository;
    private readonly sharedService;
    constructor(usersService: UsersService, userRepository: Repository<User>, sharedService: SharedService);
    createAdmin(createUserDto: CreateUserDto, response: Response): Promise<Response<any, Record<string, any>>>;
}

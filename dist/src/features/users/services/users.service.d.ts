import { Repository } from 'typeorm';
import { UpdateUserDto } from 'src/auth/dto/update-user.dto';
import { User } from 'src/auth/entities/user.entity';
import { ApiResponseDTO } from 'src/shared/response/api-response';
export declare class UsersService {
    private readonly userRepository;
    constructor(userRepository: Repository<User>);
    findOneById(id: string): Promise<ApiResponseDTO<User>>;
    findOneByEmail(email: string): Promise<User>;
    update(id: string, newUser: UpdateUserDto): Promise<ApiResponseDTO<User>>;
}

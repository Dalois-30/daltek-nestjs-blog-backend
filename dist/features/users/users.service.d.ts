import { Repository } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { JwtService } from '@nestjs/jwt';
import { UpdateUserDto } from 'src/auth/dto/update-user.dto';
import { User } from 'src/auth/entities/user.entity';
export declare class UsersService {
    private readonly userRepository;
    private readonly httpService;
    private readonly jwtService;
    constructor(userRepository: Repository<User>, httpService: HttpService, jwtService: JwtService);
    findAll(headers: string): Promise<User[]>;
    findOneById(id: string): Promise<User>;
    findOneByEmail(email: string): Promise<User>;
    update(id: string, newUser: UpdateUserDto): Promise<User>;
    deleteUserById(id: string): Promise<import("typeorm").DeleteResult>;
    deleteAll(): Promise<void>;
}

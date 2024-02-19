import { User } from 'src/auth/entities/user.entity';
import { Role } from 'src/features/role/entities/role.entity';
import { Repository } from 'typeorm';
export declare class DatabaseModule {
    private readonly userRepository;
    private readonly roleRepository;
    constructor(userRepository: Repository<User>, roleRepository: Repository<Role>);
    private readonly logger;
    onModuleInit(): Promise<void>;
}

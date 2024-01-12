import { Role } from '../entities/role.entity';
import { Repository } from 'typeorm';
import { ApiResponseDTO } from 'src/shared/response/api-response';
export declare class RoleService {
    private readonly roleRepository;
    constructor(roleRepository: Repository<Role>);
    findAll(): Promise<ApiResponseDTO<Role[]>>;
}

import { ApiResponseDTO } from 'src/shared/response/api-response';
import { Repository } from 'typeorm';
import { Response } from 'express';
import { Role } from 'src/features/role/entities/role.entity';
import { CreateRoleDto } from '../dto/create-role.dto';
export declare class AdminRoleService {
    private readonly roleRepository;
    constructor(roleRepository: Repository<Role>);
    createRole(createRoleDto: CreateRoleDto, response: Response): Promise<Response<any, Record<string, any>>>;
    updateRole(roleId: string, roleUpdateDto: CreateRoleDto): Promise<ApiResponseDTO<Role>>;
}

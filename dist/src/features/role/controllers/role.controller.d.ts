import { RoleService } from '../service/role.service';
import { Role } from '../entities/role.entity';
import { ApiResponseDTO } from 'src/shared/response/api-response';
export declare class RoleController {
    private roleService;
    constructor(roleService: RoleService);
    getAllUsers(headers: any): Promise<ApiResponseDTO<Role[]>>;
}

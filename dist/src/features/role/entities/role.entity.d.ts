import { User } from '../../../auth/entities/user.entity';
export declare class Role {
    id: string;
    roleName: string;
    userRoles: User[];
    created_at: Date;
    updated_at: Date;
}

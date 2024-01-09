import { User } from './user.entity';
export declare class RoleEntity {
    id: string;
    roleName: string;
    users: User[];
    created_at: Date;
    updated_at: Date;
}

import { UserRoles } from '../constant/user-roles';
export declare class User {
    id: string;
    email: string;
    password: string;
    verified: boolean;
    role: UserRoles;
    hashPassword(): Promise<void>;
    created_at: Date;
    updated_at: Date;
}

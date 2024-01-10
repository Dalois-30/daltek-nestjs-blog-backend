import { Role } from "src/features/role/entities/role.entity";
import { User } from "./user.entity";
export declare class UserRole {
    id: string;
    user: User;
    role: Role;
}

import { UserRoles } from '../constant/user-roles';
export declare class CreateUserDto {
    email: string;
    readonly password: string;
    readonly username: string;
    readonly role: UserRoles;
}
export declare class ResetPassWordDto {
    readonly actualPassword: string;
    readonly newPassword: string;
}

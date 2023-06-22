import { UserRoles } from '../constant/user-roles';
export declare class UpdateUserDto {
    readonly email?: string;
    readonly username?: string;
    readonly verified?: boolean;
    readonly role?: UserRoles;
}
export declare class UpdateUserDtoPassword {
    readonly email?: string;
    password?: string;
    readonly username?: string;
    readonly verified?: boolean;
    readonly role?: UserRoles;
}

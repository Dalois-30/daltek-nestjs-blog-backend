export declare class CreateUserDto {
    email: string;
    readonly password: string;
    readonly username: string;
}
export declare class ResetPassWordDto {
    readonly actualPassword: string;
    readonly newPassword: string;
}

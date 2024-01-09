import { Response } from 'express';
import { UsersService } from 'src/features/users/services/users.service';
export declare class SharedService {
    private usersService;
    constructor(usersService: UsersService);
    createEmailToken(email: string, res: Response): Promise<{}>;
    sendEmail(mailOptions: any): Promise<{}>;
}

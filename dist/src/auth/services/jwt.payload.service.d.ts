import { JwtService } from '@nestjs/jwt';
import { User } from '../entities/user.entity';
export declare class JwtPayloadService {
    private readonly jwtService;
    constructor(jwtService: JwtService);
    createJwtPayload(user: User): {
        expiresIn: number;
        token: any;
    };
}

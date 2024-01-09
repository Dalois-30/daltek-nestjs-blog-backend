import { JwtService } from '@nestjs/jwt';
export declare class JwtPayloadService {
    private readonly jwtService;
    constructor(jwtService: JwtService);
    createJwtPayload(user: any): {
        expiresIn: number;
        token: any;
    };
}

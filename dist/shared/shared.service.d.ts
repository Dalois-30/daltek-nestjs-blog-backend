import { HttpService } from '@nestjs/axios';
import { JwtService } from '@nestjs/jwt';
export declare class SharedService {
    private readonly httpService;
    private readonly jwtService;
    constructor(httpService: HttpService, jwtService: JwtService);
    checkIfAdmin(headers: any): Promise<void>;
    decodeToken(headers: any): Promise<any>;
}

// admin.middleware.ts

import { Injectable, NestMiddleware, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AdminMiddleware implements NestMiddleware {

    constructor(private readonly jwtService: JwtService) { }

    async use(req: Request, res: Response, next: NextFunction) {
        try {
            await this.checkIfAdmin(req.headers);
            next();
        } catch (error) {
            next(error);
        }
    }

    async checkIfAdmin(headers: any) {
        const decodedJwtAccessToken = await this.decodeToken(headers);
        // Check if the user has admin rights
        if (decodedJwtAccessToken.role !== "Admin") {
            throw new HttpException('You are not an admin', HttpStatus.UNAUTHORIZED);
        }
    }

    async decodeToken(headers: any) {
        // Get the token from headers
        let token = headers["authorization"].split(' ');
        // Decode the token
        const decodedJwtAccessToken: any = this.jwtService.decode(token[1]);
        return decodedJwtAccessToken;
    }
}

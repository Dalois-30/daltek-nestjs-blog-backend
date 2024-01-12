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
        try {
            const decodedJwtAccessToken = await this.verifyToken(headers);

            // Check if the user has admin rights
            if (!decodedJwtAccessToken.roles || !decodedJwtAccessToken.roles.includes("Admin")) {
                throw new HttpException('You are not an admin', HttpStatus.UNAUTHORIZED);
            }
        } catch (error) {
            throw new HttpException('Invalid token or unauthorized', HttpStatus.UNAUTHORIZED);
        }
    }


    async verifyToken(headers: any) {
        try {
            // Get the token from headers
            let token = headers["authorization"].split(' ');

            // Verify and decode the token
            const decodedJwtAccessToken: any = await this.jwtService.verify(token[1]);

            // Le token est vérifié et décodé avec succès
            return decodedJwtAccessToken;
        } catch (error) {
            // Une erreur s'est produite lors de la vérification ou du décodage du token
            throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
        }
    }

}

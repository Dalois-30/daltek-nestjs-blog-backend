// logger.middleware.ts

import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt'; // Importez le service JWT

@Injectable()
export class AuthMiddleware implements NestMiddleware {

  constructor(private readonly jwtService: JwtService) {}

  use(req: Request, res: Response, next: NextFunction) {
    this.logDecodedToken(req.headers);
    next();
  }

  logDecodedToken(headers: any) {
    try {
      const decodedJwtAccessToken = this.decodeToken(headers);
      console.log('Decoded JWT Access Token:', decodedJwtAccessToken);
    } catch (error) {
      console.error('Error decoding JWT Access Token:', error.message);
    }
  }

  decodeToken(headers: any) {
    // Get the token from headers
    let token = headers["authorization"].split(' ');
    // Decode the token
    const decodedJwtAccessToken: any = this.jwtService.decode(token[1]);
    return decodedJwtAccessToken;
  }
}

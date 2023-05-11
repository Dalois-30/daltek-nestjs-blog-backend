import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class SharedService {

    constructor(
        private readonly httpService: HttpService,
        private readonly jwtService: JwtService
    ) { }


    async checkIfAdmin(headers: any) {
        const decodedJwtAccessToken = await this.decodeToken(headers)
        // check if the user has admin rights
        if (decodedJwtAccessToken.role !== "Admin") {
            throw new HttpException('Your are not admin', HttpStatus.UNAUTHORIZED);
        }
    }

    async decodeToken(headers: any) {
        // get the token from headers
        let token = headers["authorization"].split(' ')
        console.log(token[1]);
        // decode the token and 
        const decodedJwtAccessToken: any = this.jwtService.decode(token[1]);
        console.log(decodedJwtAccessToken);
        return decodedJwtAccessToken;
    }
}

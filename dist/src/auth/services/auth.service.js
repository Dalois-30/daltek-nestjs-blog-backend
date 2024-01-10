"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const bcrypt = require("bcrypt");
const typeorm_1 = require("typeorm");
const typeorm_2 = require("@nestjs/typeorm");
require("dotenv/config");
const update_user_dto_1 = require("../dto/update-user.dto");
const user_entity_1 = require("../entities/user.entity");
const jwt_payload_service_1 = require("./jwt.payload.service");
const api_response_1 = require("../../shared/response/api-response");
const shared_service_1 = require("../../shared/services/shared.service");
const users_service_1 = require("../../features/users/services/users.service");
const phoneRegex = /^6(?=[579])([0-9]{8})/;
let AuthService = class AuthService {
    constructor(usersService, jwtPayloadService, userRepository, sharedService) {
        this.usersService = usersService;
        this.jwtPayloadService = jwtPayloadService;
        this.userRepository = userRepository;
        this.sharedService = sharedService;
    }
    async create(createUserDto, response) {
        const res = new api_response_1.ApiResponseDTO();
        try {
            const user = await this.usersService.findOneByEmail(createUserDto.email);
            if (user) {
                throw new common_1.HttpException('User already exists', common_1.HttpStatus.BAD_REQUEST);
            }
            const userName = await this.userRepository.findOneBy({ username: createUserDto.username });
            if (userName) {
                throw new common_1.HttpException('username already exists', common_1.HttpStatus.CONFLICT);
            }
            const newUser = new user_entity_1.User();
            newUser.email = createUserDto.email;
            newUser.password = createUserDto.password;
            newUser.username = createUserDto.username;
            const userResponse = await this.userRepository.save(newUser);
            await this.sharedService.createEmailToken(newUser.email, response);
            res.data = userResponse;
            res.statusCode = common_1.HttpStatus.CREATED;
            res.message = "user created successfully";
        }
        catch (error) {
            res.statusCode = common_1.HttpStatus.BAD_REQUEST;
            res.message = error.message;
        }
        return response.send(res);
    }
    async resetPassword(email, resetPassWord) {
        const res = new api_response_1.ApiResponseDTO();
        try {
            const user = await this.userRepository.findOneBy({
                email: email,
            });
            if (!user) {
                throw new common_1.UnauthorizedException('User does not exist');
            }
            const state = await this.checkPassword(resetPassWord.actualPassword, user);
            if (state) {
                const newUser = new update_user_dto_1.UpdateUserDtoPassword();
                newUser.password = resetPassWord.newPassword;
                this.userRepository.merge(user, newUser);
                await this.userRepository.save(user);
                res.message = "Successful Updated";
                res.statusCode = common_1.HttpStatus.OK;
            }
            else {
                throw new common_1.HttpException('Wrong credentials', common_1.HttpStatus.UNAUTHORIZED);
            }
        }
        catch (error) {
            res.statusCode = common_1.HttpStatus.BAD_REQUEST;
            res.message = error.message;
        }
        return res;
    }
    async validateUserByPassword(loginUserDto) {
        const res = new api_response_1.ApiResponseDTO();
        try {
            const user = await this.usersService.findOneByEmail(loginUserDto.email);
            if (!user) {
                throw new common_1.UnauthorizedException('User does not exist');
            }
            const promise = await new Promise(async (resolve) => {
                const state = await this.checkPassword(loginUserDto.password, user);
                if (state) {
                    resolve(this.jwtPayloadService.createJwtPayload(user));
                }
                else {
                    resolve({ status: 401 });
                }
            });
            if (promise.status !== 401) {
                res.data = promise;
                res.message = "Success";
                res.statusCode = common_1.HttpStatus.OK;
            }
            else {
                throw new common_1.HttpException('Wrong credentials', common_1.HttpStatus.UNAUTHORIZED);
            }
        }
        catch (error) {
            res.statusCode = common_1.HttpStatus.BAD_REQUEST;
            res.message = error.message;
        }
        return res;
    }
    async checkPassword(password, user) {
        return new Promise(async (resolve) => {
            await bcrypt.compare(password, user.password, async (err, isMatch) => {
                if (err) {
                    return err;
                }
                resolve(isMatch);
            });
        });
    }
    async validateUserByJwt(payload) {
        const user = await this.usersService.findOneByEmail(payload.email);
        if (user) {
            return this.jwtPayloadService.createJwtPayload(user);
        }
        else {
            throw new common_1.UnauthorizedException();
        }
    }
    async verifyEmail(token, email, req) {
        const otp = req.cookies['OTP'];
        if (!otp) {
            throw new common_1.HttpException('token expired', common_1.HttpStatus.NOT_FOUND);
        }
        const res = new api_response_1.ApiResponseDTO();
        console.log(otp, token);
        if (otp !== token) {
            throw new common_1.HttpException('Otp invalide', common_1.HttpStatus.NOT_ACCEPTABLE);
        }
        const userFromDb = await this.usersService.findOneByEmail(email);
        if (userFromDb) {
            await this.usersService.update(userFromDb.id, {
                verified: true,
            });
        }
        res.data = otp;
        res.message = "successfully verified OTP";
        return res;
    }
};
AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, typeorm_2.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_payload_service_1.JwtPayloadService,
        typeorm_1.Repository,
        shared_service_1.SharedService])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map
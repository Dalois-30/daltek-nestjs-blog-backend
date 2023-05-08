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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const axios_1 = require("@nestjs/axios");
const jwt_1 = require("@nestjs/jwt");
const user_entity_1 = require("../../auth/entities/user.entity");
let UsersService = class UsersService {
    constructor(userRepository, httpService, jwtService) {
        this.userRepository = userRepository;
        this.httpService = httpService;
        this.jwtService = jwtService;
    }
    async findAll(headers) {
        let token = headers["authorization"].split(' ');
        console.log(token[1]);
        const decodedJwtAccessToken = this.jwtService.decode(token[1]);
        console.log(decodedJwtAccessToken);
        if (decodedJwtAccessToken.role !== "Admin") {
            throw new common_1.HttpException('Your are not admin', common_1.HttpStatus.UNAUTHORIZED);
        }
        return await this.userRepository.find();
    }
    async findOneById(id) {
        return await this.userRepository.findOneBy({ id });
    }
    async findOneByEmail(email) {
        return await this.userRepository.findOneBy({ email });
    }
    async update(id, newUser) {
        const user = await this.userRepository.findOneBy({
            id: id,
        });
        if (newUser.email) {
            const userWithEmail = await this.userRepository.findOneBy({
                email: newUser.email,
            });
            if (userWithEmail !== null &&
                userWithEmail !== undefined &&
                newUser.email !== user.email) {
                throw new common_1.HttpException('Email is already used', common_1.HttpStatus.BAD_REQUEST);
            }
        }
        if (user === undefined || user === null) {
            throw new common_1.HttpException("User doesn't exists", common_1.HttpStatus.BAD_REQUEST);
        }
        await this.userRepository.merge(user, newUser);
        return await this.userRepository.save(user);
    }
    async deleteUserById(id) {
        const user = await this.userRepository.findOneBy({ id: id });
        if (user === undefined || user === null) {
            throw new common_1.HttpException("User doesn't exists", common_1.HttpStatus.BAD_REQUEST);
        }
        return await this.userRepository.delete(id);
    }
    async deleteAll() {
        return await this.userRepository.clear();
    }
};
UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        axios_1.HttpService,
        jwt_1.JwtService])
], UsersService);
exports.UsersService = UsersService;
//# sourceMappingURL=users.service.js.map
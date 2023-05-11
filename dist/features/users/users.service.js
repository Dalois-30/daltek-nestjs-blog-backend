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
const api_response_1 = require("../../shared/response/api-response");
const shared_service_1 = require("../../shared/shared.service");
let UsersService = class UsersService {
    constructor(userRepository, httpService, jwtService, sharedService) {
        this.userRepository = userRepository;
        this.httpService = httpService;
        this.jwtService = jwtService;
        this.sharedService = sharedService;
    }
    async findAll(headers) {
        const res = new api_response_1.ApiResponseDTO();
        try {
            await this.sharedService.checkIfAdmin(headers);
            const result = await this.userRepository.find();
            res.data = result;
            res.message = "Successfully get user information";
            res.statusCode = common_1.HttpStatus.OK;
        }
        catch (error) {
            res.statusCode = common_1.HttpStatus.BAD_REQUEST;
            res.message = error.message;
        }
        return res;
    }
    async findOneById(id) {
        const res = new api_response_1.ApiResponseDTO();
        try {
            const result = await this.userRepository.findOneBy({ id });
            res.data = result;
            res.message = "Successful retrieve user";
            res.statusCode = common_1.HttpStatus.OK;
        }
        catch (error) {
            res.statusCode = common_1.HttpStatus.BAD_REQUEST;
            res.message = error.message;
        }
        return res;
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
        jwt_1.JwtService,
        shared_service_1.SharedService])
], UsersService);
exports.UsersService = UsersService;
//# sourceMappingURL=users.service.js.map
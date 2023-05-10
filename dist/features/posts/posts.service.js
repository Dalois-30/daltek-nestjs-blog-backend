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
exports.PostsService = void 0;
const axios_1 = require("@nestjs/axios");
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const posts_model_1 = require("./models/posts.model");
let PostsService = class PostsService {
    constructor(postRepository, httpService, jwtService) {
        this.postRepository = postRepository;
        this.httpService = httpService;
        this.jwtService = jwtService;
    }
    async findAll() {
        return await this.postRepository.find();
    }
    async findOneById(id) {
        return await this.postRepository.findOneBy({ id });
    }
    async update(id, newpost) {
        const post = await this.postRepository.findOneBy({
            id: id,
        });
        if (post === undefined || post === null) {
            throw new common_1.HttpException("post doesn't exists", common_1.HttpStatus.BAD_REQUEST);
        }
        await this.postRepository.merge(post, newpost);
        return await this.postRepository.save(post);
    }
    async deletepostById(id) {
        const post = await this.postRepository.findOneBy({ id: id });
        if (post === undefined || post === null) {
            throw new common_1.HttpException("post doesn't exists", common_1.HttpStatus.BAD_REQUEST);
        }
        return await this.postRepository.delete(id);
    }
    async deleteAll(headers) {
        let token = headers["authorization"].split(' ');
        console.log(token[1]);
        const decodedJwtAccessToken = this.jwtService.decode(token[1]);
        console.log(decodedJwtAccessToken);
        if (decodedJwtAccessToken.role !== "Admin") {
            throw new common_1.HttpException('Your are not admin', common_1.HttpStatus.UNAUTHORIZED);
        }
        return await this.postRepository.clear();
    }
};
PostsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(posts_model_1.Post)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        axios_1.HttpService,
        jwt_1.JwtService])
], PostsService);
exports.PostsService = PostsService;
//# sourceMappingURL=posts.service.js.map
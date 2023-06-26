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
const category_model_1 = require("../categories/models/category.model");
const api_response_1 = require("../../shared/response/api-response");
const upload_service_1 = require("../../shared/upload/upload.service");
const get_file_dto_1 = require("../../shared/upload/get-file-dto");
const post_get_dto_1 = require("./dto/post-get-dto");
const user_entity_1 = require("../../auth/entities/user.entity");
let PostsService = class PostsService {
    constructor(postRepository, httpService, jwtService, categoryRepository, userRepository, uploadService) {
        this.postRepository = postRepository;
        this.httpService = httpService;
        this.jwtService = jwtService;
        this.categoryRepository = categoryRepository;
        this.userRepository = userRepository;
        this.uploadService = uploadService;
    }
    async create(post, file) {
        const res = new api_response_1.ApiResponseDTO();
        try {
            const category = await this.categoryRepository.findOneBy({
                id: post.category
            });
            if (!category) {
                throw new common_1.HttpException("category not found", common_1.HttpStatus.BAD_REQUEST);
            }
            const author = await this.userRepository.findOneBy({
                id: post.author
            });
            if (!author) {
                throw new common_1.HttpException("user not found", common_1.HttpStatus.NO_CONTENT);
            }
            const image = await this.uploadService.upload(file.originalname, file.buffer);
            const newPost = this.postRepository.create({
                title: post.title,
                content: post.content,
                image: image,
                status: post.status,
                user: author,
                category: category,
                tags: post.tags
            });
            const result = await this.postRepository.save(newPost);
            res.data = result;
            res.message = "successfully created category";
            res.statusCode = common_1.HttpStatus.CREATED;
        }
        catch (error) {
            res.message = error.message;
            res.statusCode = common_1.HttpStatus.BAD_REQUEST;
        }
        return res;
    }
    async findAll(page, limit) {
        const res = new api_response_1.ApiResponseDTO();
        let totalGet = 0;
        try {
            let [result, total] = await this.postRepository.createQueryBuilder('post')
                .leftJoinAndSelect('post.user', 'user')
                .leftJoinAndSelect('post.comments', 'comments')
                .skip(page * limit)
                .take(limit)
                .getManyAndCount();
            totalGet = total;
            let postsGet = [];
            for (let index = 0; index < result.length; index++) {
                const post = result[index];
                let postGet = new post_get_dto_1.PostObjectToSendWithImage();
                let urlObj = new get_file_dto_1.GetFileDto();
                urlObj.key = post.image;
                let img = await this.uploadService.getUploadedObject(urlObj);
                let postDto = new post_get_dto_1.PostObjectToSendDTO();
                postDto.id = post.id;
                postDto.title = post.title;
                postDto.category = post.category;
                postDto.content = post.content;
                postDto.user = post.user.username;
                postDto.status = post.status;
                postDto.comments = post.comments.length;
                postDto.created_at = post.created_at;
                postDto.updated_at = post.updated_at;
                postGet.post = postDto;
                postGet.image = img;
                postsGet.push(postGet);
            }
            res.data = postsGet;
            res.message = "success";
            res.statusCode = common_1.HttpStatus.OK;
        }
        catch (error) {
            res.statusCode = common_1.HttpStatus.BAD_REQUEST;
            res.message = error.message;
        }
        return Object.assign(Object.assign({}, res), { totalItems: totalGet, currentPage: page, pageCount: Math.ceil(totalGet / limit) });
    }
    async findOneById(id) {
        const res = new api_response_1.ApiResponseDTO();
        try {
            const post = await this.postRepository.findOne({
                where: {
                    id: id
                },
                relations: {
                    user: true,
                    comments: true,
                    category: true
                }
            });
            if (!post) {
                throw new common_1.HttpException("post not found", common_1.HttpStatus.NOT_FOUND);
            }
            let postGet = new post_get_dto_1.PostGetDTO();
            let urlObj = new get_file_dto_1.GetFileDto();
            urlObj.key = post.image;
            let img = await this.uploadService.getUploadedObject(urlObj);
            postGet.post = post;
            postGet.image = img;
            res.data = postGet;
            res.message = "success";
            res.statusCode = common_1.HttpStatus.OK;
        }
        catch (error) {
            res.statusCode = common_1.HttpStatus.BAD_REQUEST;
            res.message = error.message;
        }
        return res;
    }
    async update(id, newpost) {
        const res = new api_response_1.ApiResponseDTO();
        try {
            const post = await this.postRepository.findOneBy({
                id: id,
            });
            if (post === undefined || post === null) {
                throw new common_1.HttpException("post doesn't exists", common_1.HttpStatus.BAD_REQUEST);
            }
            await this.postRepository.merge(post, newpost);
            const result = await this.postRepository.save(post);
            res.data = result;
            res.message = "success";
            res.statusCode = common_1.HttpStatus.OK;
        }
        catch (error) {
            res.statusCode = common_1.HttpStatus.BAD_REQUEST;
            res.message = error.message;
        }
        return res;
    }
    async deletepostById(id) {
        const res = new api_response_1.ApiResponseDTO();
        try {
            const post = await this.postRepository.findOneBy({ id: id });
            if (post === undefined || post === null) {
                throw new common_1.HttpException("post doesn't exists", common_1.HttpStatus.BAD_REQUEST);
            }
            await this.postRepository.delete(id);
            res.statusCode = common_1.HttpStatus.OK;
            res.message = "Post deleted successfully";
        }
        catch (error) {
            res.statusCode = common_1.HttpStatus.BAD_REQUEST;
            res.message = error.message;
        }
        return res;
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
    __param(0, (0, typeorm_1.InjectRepository)(posts_model_1.Posts)),
    __param(3, (0, typeorm_1.InjectRepository)(category_model_1.Category)),
    __param(4, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        axios_1.HttpService,
        jwt_1.JwtService,
        typeorm_2.Repository,
        typeorm_2.Repository,
        upload_service_1.UploadService])
], PostsService);
exports.PostsService = PostsService;
//# sourceMappingURL=posts.service.js.map
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
exports.PostsController = void 0;
const common_1 = require("@nestjs/common");
const create_post_dto_1 = require("../dto/create-post-dto");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const upload_service_1 = require("../../../shared/upload/upload.service");
const posts_service_1 = require("../services/posts.service");
let PostsController = class PostsController {
    constructor(postService, uploadService) {
        this.postService = postService;
        this.uploadService = uploadService;
    }
    async getAllpost(page = 0, limit = 10) {
        return await this.postService.findAll(page, limit);
    }
    async createpost(file, post) {
        return await this.postService.create(post, file);
    }
    async getpostById(id) {
        return await this.postService.findOneById(id);
    }
    async updatepost(id, post) {
        return await this.postService.update(id, post);
    }
};
exports.PostsController = PostsController;
__decorate([
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Fetched all post' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false }),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], PostsController.prototype, "getAllpost", null);
__decorate([
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                title: { type: 'string' },
                content: { type: 'string' },
                parent: { type: 'string' },
                tags: { type: 'string' },
                author: { type: 'string' },
                category: { type: 'string' },
                file: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Create new post' }),
    (0, common_1.Post)('/create'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.UploadedFile)(new common_1.ParseFilePipe({
        validators: []
    }))),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_post_dto_1.CreatePostDto]),
    __metadata("design:returntype", Promise)
], PostsController.prototype, "createpost", null);
__decorate([
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Fetched specific post' }),
    (0, common_1.Get)('/getOne/:postId'),
    __param(0, (0, common_1.Param)('postId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PostsController.prototype, "getpostById", null);
__decorate([
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Fetched all post' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'post not found' }),
    (0, common_1.Put)('/update/:postId'),
    __param(0, (0, common_1.Param)('postId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_post_dto_1.UpdatePostDto]),
    __metadata("design:returntype", Promise)
], PostsController.prototype, "updatepost", null);
exports.PostsController = PostsController = __decorate([
    (0, swagger_1.ApiTags)('posts'),
    (0, common_1.Controller)('posts'),
    __metadata("design:paramtypes", [posts_service_1.PostsService,
        upload_service_1.UploadService])
], PostsController);
//# sourceMappingURL=posts.controller.js.map
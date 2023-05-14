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
exports.CommentsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const comments_model_1 = require("./models/comments.model");
const typeorm_2 = require("typeorm");
const posts_model_1 = require("../posts/models/posts.model");
const user_entity_1 = require("../../auth/entities/user.entity");
const api_response_1 = require("../../shared/response/api-response");
let CommentsService = class CommentsService {
    constructor(commentsRepository, postsRepository, userRepository) {
        this.commentsRepository = commentsRepository;
        this.postsRepository = postsRepository;
        this.userRepository = userRepository;
    }
    async create(comment) {
        const res = new api_response_1.ApiResponseDTO();
        try {
            const user = await this.userRepository.findOneBy({
                id: comment.user
            });
            if (!user) {
                throw new common_1.HttpException("user does'nt exist", common_1.HttpStatus.NOT_FOUND);
            }
            const post = await this.postsRepository.findOneBy({
                id: comment.post
            });
            if (!post) {
                throw new common_1.HttpException("post does'nt exist", common_1.HttpStatus.NOT_FOUND);
            }
            const newComment = this.commentsRepository.create({
                content: comment.content,
                user: user,
                post: post,
            });
            if (comment.parent) {
                const parentComment = await this.commentsRepository.findOneBy({
                    id: comment.parent
                });
                if (!parentComment) {
                    throw new common_1.HttpException("parent comment does'nt exist", common_1.HttpStatus.NOT_FOUND);
                }
                newComment.parent = parentComment;
            }
            const result = await this.commentsRepository.save(newComment);
            res.data = result;
            res.message = "successfully saved new comment";
            res.statusCode = common_1.HttpStatus.CREATED;
        }
        catch (error) {
            res.message = error.message;
            res.statusCode = common_1.HttpStatus.BAD_REQUEST;
        }
        return res;
    }
};
CommentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(comments_model_1.Comments)),
    __param(1, (0, typeorm_1.InjectRepository)(posts_model_1.Posts)),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], CommentsService);
exports.CommentsService = CommentsService;
//# sourceMappingURL=comments.service.js.map
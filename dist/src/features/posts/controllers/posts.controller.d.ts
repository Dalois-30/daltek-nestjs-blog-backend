/// <reference types="multer" />
import { CreatePostDto, UpdatePostDto } from '../dto/create-post-dto';
import { UploadService } from 'src/shared/upload/upload.service';
import { PostsService } from '../services/posts.service';
import { ApiResponseDTO } from 'src/shared/response/api-response';
import { PostGetDTO } from '../dto/post-get-dto';
export declare class PostsController {
    private postService;
    private readonly uploadService;
    constructor(postService: PostsService, uploadService: UploadService);
    getAllpost(page?: number, limit?: number): Promise<{
        totalItems: number;
        currentPage: number;
        pageCount: number;
        data?: import("../dto/post-get-dto").PostObjectToSendWithImage[];
        message?: any;
        statusCode?: number;
    }>;
    createpost(file: Express.Multer.File, post: CreatePostDto): Promise<ApiResponseDTO<import("../models/posts.model").Posts>>;
    getpostById(id: string): Promise<ApiResponseDTO<PostGetDTO>>;
    updatepost(id: string, post: UpdatePostDto): Promise<ApiResponseDTO<import("../models/posts.model").Posts>>;
}

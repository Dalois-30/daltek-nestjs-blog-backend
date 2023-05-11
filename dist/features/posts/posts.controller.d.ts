/// <reference types="multer" />
import { CreatePostDto } from './dto/create-post-dto';
import { UploadService } from 'src/shared/upload/upload.service';
import { PostsService } from './posts.service';
import { Posts } from './models/posts.model';
import { ApiResponseDTO } from 'src/shared/response/api-response';
export declare class PostsController {
    private postService;
    private readonly uploadService;
    constructor(postService: PostsService, uploadService: UploadService);
    getAllpost(page?: number, limit?: number): Promise<{
        totalItems: number;
        currentPage: number;
        pageCount: number;
        data?: import("./dto/post-get-dto").PostGetDTO[];
        message?: any;
        statusCode?: number;
    }>;
    createpost(file: Express.Multer.File, post: CreatePostDto): Promise<ApiResponseDTO<Posts>>;
    getpostById(id: string): Promise<ApiResponseDTO<Posts>>;
    updatepost(id: string, post: CreatePostDto): Promise<ApiResponseDTO<Posts>>;
}

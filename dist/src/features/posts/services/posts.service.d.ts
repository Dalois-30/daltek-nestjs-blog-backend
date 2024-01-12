/// <reference types="multer" />
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { Posts } from '../models/posts.model';
import { CreatePostDto, UpdatePostDto } from '../dto/create-post-dto';
import { Category } from '../../categories/models/category.model';
import { ApiResponseDTO } from 'src/shared/response/api-response';
import { UploadService } from 'src/shared/upload/upload.service';
import { PostObjectToSendWithImage, PostGetDTO } from '../dto/post-get-dto';
import { User } from 'src/auth/entities/user.entity';
export declare class PostsService {
    private readonly postRepository;
    private readonly jwtService;
    private readonly categoryRepository;
    private readonly userRepository;
    private readonly uploadService;
    constructor(postRepository: Repository<Posts>, jwtService: JwtService, categoryRepository: Repository<Category>, userRepository: Repository<User>, uploadService: UploadService);
    create(post: CreatePostDto, file: Express.Multer.File): Promise<ApiResponseDTO<Posts>>;
    findAll(page?: number, limit?: number): Promise<{
        totalItems: number;
        currentPage: number;
        pageCount: number;
        data?: PostObjectToSendWithImage[];
        message?: any;
        statusCode?: number;
    }>;
    findAllPublished(page?: number, limit?: number): Promise<{
        totalItems: number;
        currentPage: number;
        pageCount: number;
        data?: PostObjectToSendWithImage[];
        message?: any;
        statusCode?: number;
    }>;
    findOneById(id: string): Promise<ApiResponseDTO<PostGetDTO>>;
    update(id: string, newPost: UpdatePostDto, file?: Express.Multer.File): Promise<ApiResponseDTO<Posts>>;
    publishPost(id: string): Promise<ApiResponseDTO<Posts>>;
    unPublishPost(id: string): Promise<ApiResponseDTO<Posts>>;
    deletepostById(id: string): Promise<ApiResponseDTO<Category>>;
    deleteAll(headers: string): Promise<void>;
}

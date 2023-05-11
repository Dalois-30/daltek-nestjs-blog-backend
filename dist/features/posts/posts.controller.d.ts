/// <reference types="multer" />
import { CreatePostDto } from './dto/create-post-dto';
import { UploadService } from 'src/shared/upload/upload.service';
import { PostsService } from './posts.service';
import { Posts } from './models/posts.model';
export declare class PostsController {
    private postService;
    private readonly uploadService;
    constructor(postService: PostsService, uploadService: UploadService);
    getAllpost(): Promise<Posts[]>;
    createpost(file: Express.Multer.File, post: CreatePostDto): Promise<Posts>;
    getpostById(id: string): Promise<Posts>;
    updatepost(id: string, post: CreatePostDto): Promise<Posts>;
}

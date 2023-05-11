import { HttpService } from '@nestjs/axios';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { Posts } from './models/posts.model';
import { CreatePostDto, UpdatePostDto } from './dto/create-post-dto';
import { Category } from '../categories/models/category.model';
export declare class PostsService {
    private readonly postRepository;
    private readonly httpService;
    private readonly jwtService;
    private readonly categoryRepository;
    constructor(postRepository: Repository<Posts>, httpService: HttpService, jwtService: JwtService, categoryRepository: Repository<Category>);
    create(post: CreatePostDto, image: string): Promise<Posts>;
    findAll(): Promise<Posts[]>;
    findOneById(id: string): Promise<Posts>;
    update(id: string, newpost: UpdatePostDto): Promise<Posts>;
    deletepostById(id: string): Promise<import("typeorm").DeleteResult>;
    deleteAll(headers: string): Promise<void>;
}

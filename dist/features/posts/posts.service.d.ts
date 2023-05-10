import { HttpService } from '@nestjs/axios';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { Post } from './models/posts.model';
import { UpdatePostDto } from './dto/create-post-dto';
export declare class PostsService {
    private readonly postRepository;
    private readonly httpService;
    private readonly jwtService;
    constructor(postRepository: Repository<Post>, httpService: HttpService, jwtService: JwtService);
    findAll(): Promise<Post[]>;
    findOneById(id: string): Promise<Post>;
    update(id: string, newpost: UpdatePostDto): Promise<Post>;
    deletepostById(id: string): Promise<import("typeorm").DeleteResult>;
    deleteAll(headers: string): Promise<void>;
}

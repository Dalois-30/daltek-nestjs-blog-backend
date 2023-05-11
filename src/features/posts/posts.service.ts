import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Posts } from './models/posts.model';
import { CreatePostDto, UpdatePostDto } from './dto/create-post-dto';
import { generateRandomString } from 'src/auth/constant/constants';
import { Category } from '../categories/models/category.model';

@Injectable()
export class PostsService {

    constructor(
        @InjectRepository(Posts)
        private readonly postRepository: Repository<Posts>,
        private readonly httpService: HttpService,
        private readonly jwtService: JwtService,
        @InjectRepository(Category)
        private readonly categoryRepository: Repository<Category>,
    ) { }

        /**
     * 
     * @param post post dta 
     * @returns the post object newly created
     */
        async create(post: CreatePostDto, image: string) {
            // get the corresponding category 
            const category = await this.categoryRepository.findOneBy({
                id: post.category
            });
            if (!category) {
                throw new HttpException("category not found", HttpStatus.BAD_REQUEST);
            }
            // create new post from the dto and the category
            const newPost = this.postRepository.create({
                title: post.title,
                content: post.content,
                image: image,
                status: post.status,
                tags: post.tags
            });
    
            newPost.category = category;
            // save category on database
            await this.postRepository.save(newPost);
            return newPost;
        }

    /**
    * 
    * @returns the lis of all posts
    */
    async findAll(): Promise<Posts[]> {

        return await this.postRepository.find();
    }
    /**
     * 
     * @param id 
     * @returns returns the specified post by its email
     */
    async findOneById(id: string): Promise<Posts> {
        return await this.postRepository.findOneBy({ id });
    }
    /**
     * 
     * @param id 
     * @param newpost 
     * @returns updates post information
     */
    async update(id: string, newpost: UpdatePostDto) {
        const post = await this.postRepository.findOneBy({
            id: id,
        });
        // check if post doesn't exist or have already an email
        if (post === undefined || post === null) {
            throw new HttpException("post doesn't exists", HttpStatus.BAD_REQUEST);
        }
        // merge and save the modified post
        await this.postRepository.merge(post, newpost);
        return await this.postRepository.save(post);
    }
    /**
     * 
     * @param id 
     * @returns delete post from database based on it's id
     */
    async deletepostById(id: string) {

        // first get the post
        const post = await this.postRepository.findOneBy({ id: id });
        // then check if it exists
        if (post === undefined || post === null) {
            throw new HttpException("post doesn't exists", HttpStatus.BAD_REQUEST);
        }

        return await this.postRepository.delete(id);
    }
    /**
     * 
     * @returns delete all posts from the database
     */
    async deleteAll(headers: string) {
        let token = headers["authorization"].split(' ')
        console.log(token[1]);
        const decodedJwtAccessToken: any = this.jwtService.decode(token[1]);
        console.log(decodedJwtAccessToken);
        if (decodedJwtAccessToken.role !== "Admin") {
            throw new HttpException('Your are not admin', HttpStatus.UNAUTHORIZED);
        }
        return await this.postRepository.clear();
    }
}

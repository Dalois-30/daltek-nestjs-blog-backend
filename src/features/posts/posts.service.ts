import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Posts } from './models/posts.model';
import { CreatePostDto, UpdatePostDto } from './dto/create-post-dto';
import { generateRandomString } from 'src/auth/constant/constants';
import { Category } from '../categories/models/category.model';
import { ApiResponseDTO } from 'src/shared/response/api-response';
import { UploadService } from 'src/shared/upload/upload.service';
import { GetFileDto } from 'src/shared/upload/get-file-dto';
import { PostGetDTO } from './dto/post-get-dto';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class PostsService {

    constructor(
        @InjectRepository(Posts)
        private readonly postRepository: Repository<Posts>,
        private readonly httpService: HttpService,
        private readonly jwtService: JwtService,
        @InjectRepository(Category)
        private readonly categoryRepository: Repository<Category>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly uploadService: UploadService
    ) { }

    /**
    * 
    * @param post post dta 
    * @returns the post object newly created
    */
    async create(post: CreatePostDto, file: Express.Multer.File) {
        const res = new ApiResponseDTO<Posts>();
        try {
            const category = await this.categoryRepository.findOneBy({
                id: post.category
            });
            if (!category) {
                throw new HttpException("category not found", HttpStatus.BAD_REQUEST);
            }
            const author = await this.userRepository.findOneBy({
                id: post.author
            })
            if (!author) {
                throw new HttpException("user not found", HttpStatus.NO_CONTENT);
            }
            // upload image file and get key
            const image = await this.uploadService.upload(file.originalname, file.buffer);
            // create new post from the dto and the category
            const newPost = this.postRepository.create({
                title: post.title,
                content: post.content,
                image: image,
                status: post.status,
                user: author,
                category: category,
                tags: post.tags
            });

            // save post on database
            const result = await this.postRepository.save(newPost);
            // format response
            res.data = result;
            res.message = "successfully created category"
            res.statusCode = HttpStatus.CREATED

        } catch (error) {
            res.message = error.message;
            res.statusCode = HttpStatus.BAD_REQUEST
        }
        return res;
    }

    /**
    * 
    * @returns the lis of all posts
    */
    async findAll(page?: number, limit?: number) {
        const res = new ApiResponseDTO<PostGetDTO[]>();
        let totalGet = 0;
        try {
            let [result, total] = await this.postRepository.createQueryBuilder('post')
                .leftJoinAndSelect('post.user', 'user')
                // .leftJoinAndSelect('post.children', 'children')
                .skip(page * limit)
                .take(limit)
                .getManyAndCount();
            totalGet = total;
            // create an object of the type catget to retria
            let postsGet: PostGetDTO[] = [];

            for (let index = 0; index < result.length; index++) {
                const post = result[index];
                let postGet = new PostGetDTO();
                let urlObj = new GetFileDto();
                urlObj.key = post.image;
                // get the signed link of the file
                let img = await this.uploadService.getUploadedObject(urlObj)
                // set the object 
                postGet.post = post;
                postGet.image = img;
                // updatte the table of cat with the signed link
                postsGet.push(postGet);
                console.log(postsGet.length);
            }

            res.data = postsGet
            res.message = "success";
            res.statusCode = HttpStatus.OK;
        } catch (error) {
            res.statusCode = HttpStatus.BAD_REQUEST;
            res.message = error.message
        }
        return {
            ...res,
            totalItems: totalGet,
            currentPage: page,
            pageCount: Math.ceil(totalGet / limit),
        }
    }
    /**
     * 
     * @param id 
     * @returns returns the specified post by its email
     */
    async findOneById(id: string): Promise<ApiResponseDTO<PostGetDTO>> {
        const res = new ApiResponseDTO<PostGetDTO>();

        try {
            // get posts with comments and user
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
            // check if the category exists
            if (!post) {
                throw new HttpException("post not found", HttpStatus.NOT_FOUND);
            }
            let postGet = new PostGetDTO();
            let urlObj = new GetFileDto();
            urlObj.key = post.image;
            // get the signed link of the file
            let img = await this.uploadService.getUploadedObject(urlObj)
            // set the object 
            postGet.post = post;
            postGet.image = img;

            res.data = postGet;
            res.message = "success";
            res.statusCode = HttpStatus.OK;
        } catch (error) {
            res.statusCode = HttpStatus.BAD_REQUEST;
            res.message = error.message
        }
        return res;
    }
    /**
     * 
     * @param id 
     * @param newpost 
     * @returns updates post information
     */
    async update(id: string, newpost: UpdatePostDto) {
        const res = new ApiResponseDTO<Posts>();
        try {
            const post = await this.postRepository.findOneBy({
                id: id,
            });
            // check if post doesn't exist or have already an email
            if (post === undefined || post === null) {
                throw new HttpException("post doesn't exists", HttpStatus.BAD_REQUEST);
            }
            // merge and save the modified post
            await this.postRepository.merge(post, newpost);
            const result = await this.postRepository.save(post);
            res.data = result
            res.message = "success";
            res.statusCode = HttpStatus.OK;
        } catch (error) {
            res.statusCode = HttpStatus.BAD_REQUEST;
            res.message = error.message
        }
        return res;
    }
    /**
     * 
     * @param id 
     * @returns delete post from database based on it's id
     */
    async deletepostById(id: string) {
        const res = new ApiResponseDTO<Category>();
        try {
            // first get the post
            const post = await this.postRepository.findOneBy({ id: id });
            // then check if it exists
            if (post === undefined || post === null) {
                throw new HttpException("post doesn't exists", HttpStatus.BAD_REQUEST);
            }

            await this.postRepository.delete(id);
            res.statusCode = HttpStatus.OK;
            res.message = "Post deleted successfully"
        } catch (error) {
            res.statusCode = HttpStatus.BAD_REQUEST;
            res.message = error.message
        }
        return res;
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

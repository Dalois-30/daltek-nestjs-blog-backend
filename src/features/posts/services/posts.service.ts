import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Posts } from '../models/posts.model';
import { CreatePostDto, UpdatePostDto } from '../dto/create-post-dto';
import { Category } from '../../categories/models/category.model';
import { ApiResponseDTO } from 'src/shared/response/api-response';
import { UploadService } from 'src/shared/upload/upload.service';
import { GetFileDto } from 'src/shared/upload/get-file-dto';
import { PostObjectToSendWithImage, PostGetDTO, PostObjectToSendDTO } from '../dto/post-get-dto';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class PostsService {

    constructor(
        @InjectRepository(Posts)
        private readonly postRepository: Repository<Posts>,
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
                publish: false,
                user: author,
                category: category
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
        const res = new ApiResponseDTO<PostObjectToSendWithImage[]>();
        let totalGet = 0;
        try {
            let [result, total] = await this.postRepository.createQueryBuilder('post')
                .leftJoinAndSelect('post.user', 'user')
                .leftJoinAndSelect('post.comments', 'comments')
                // .leftJoinAndSelect('post.children', 'children')
                .skip(page * limit)
                .take(limit)
                .getManyAndCount();
            totalGet = total;
            // create an object of the type catget to retria
            let postsGet: PostObjectToSendWithImage[] = [];

            for (let index = 0; index < result.length; index++) {
                const post = result[index];
                //post objects with signed url
                let postGet = new PostObjectToSendWithImage();
                let urlObj = new GetFileDto();
                urlObj.key = post.image;
                // get the signed link of the file
                let img = await this.uploadService.getUploadedObject(urlObj)
                // set the object 
                // catDto: object with the comments number not the comments object
                let postDto = new PostObjectToSendDTO();
                // set the value of this object with the post get to the database
                postDto.id = post.id;
                postDto.title = post.title;
                postDto.category = post.category;
                postDto.content = post.content;
                postDto.user = post.user.username;
                postDto.publish = post.publish;
                postDto.comments = post.comments.length;
                postDto.created_at = post.created_at;
                postDto.updated_at = post.updated_at;
                // set the post value of the data to retrieve
                postGet.post = postDto;
                postGet.image = img;
                // updatte the table of cat with the signed link
                postsGet.push(postGet);
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
    * @returns the lis of all posts
    */
    async findAllPublished(page?: number, limit?: number) {
        const res = new ApiResponseDTO<PostObjectToSendWithImage[]>();
        let totalGet = 0;
        try {
            let [result, total] = await this.postRepository.createQueryBuilder('post')
                .leftJoinAndSelect('post.user', 'user')
                .leftJoinAndSelect('post.comments', 'comments')
                .where('post.publish = :publish', { publish: true })
                // .leftJoinAndSelect('post.children', 'children')
                .skip(page * limit)
                .take(limit)
                .getManyAndCount();
            totalGet = total;
            // create an object of the type catget to retria
            let postsGet: PostObjectToSendWithImage[] = [];

            for (let index = 0; index < result.length; index++) {
                const post = result[index];
                //post objects with signed url
                let postGet = new PostObjectToSendWithImage();
                let urlObj = new GetFileDto();
                urlObj.key = post.image;
                // get the signed link of the file
                let img = await this.uploadService.getUploadedObject(urlObj)
                // set the object 
                // catDto: object with the comments number not the comments object
                let postDto = new PostObjectToSendDTO();
                // set the value of this object with the post get to the database
                postDto.id = post.id;
                postDto.title = post.title;
                postDto.category = post.category;
                postDto.content = post.content;
                postDto.user = post.user.username;
                postDto.publish = post.publish;
                postDto.comments = post.comments.length;
                postDto.created_at = post.created_at;
                postDto.updated_at = post.updated_at;
                // set the post value of the data to retrieve
                postGet.post = postDto;
                postGet.image = img;
                // updatte the table of cat with the signed link
                postsGet.push(postGet);
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
    async update(id: string, newPost: UpdatePostDto, file?: Express.Multer.File) {
        const res = new ApiResponseDTO<Posts>();
        try {
            const post = await this.postRepository.findOneBy({
                id
            });

            if (!post) {
                throw new HttpException("Post not found", HttpStatus.NOT_FOUND);
            }

            if (file) {
                // Si une nouvelle image est fournie, mettez à jour l'image
                const newImage = await this.uploadService.upload(file.originalname, file.buffer);
                post.image = newImage;
            }

            // Mettez à jour les autres champs du post
            post.title = newPost.title || post.title;
            post.content = newPost.content || post.content;
            post.publish = false;

            // Si vous souhaitez également mettre à jour la catégorie, décommentez la ligne suivante
            // post.category = newPost.category || post.category;

            // Enregistrez les modifications dans la base de données
            const result = await this.postRepository.save(post);

            res.data = result;
            res.message = "Post updated successfully";
            res.statusCode = HttpStatus.OK;

        } catch (error) {
            res.message = error.message;
            res.statusCode = HttpStatus.BAD_REQUEST;
        }

        return res;
    }

    /**
     * 
     * @param id 
     * @param newpost 
     * @returns updates post information
     */
    async publishPost(id: string) {
        const res = new ApiResponseDTO<Posts>();
        try {
            const post = await this.postRepository.findOneBy({
                id: id,
            });
            // check if post doesn't exist or have already an email
            if (post === undefined || post === null) {
                throw new HttpException("post doesn't exists", HttpStatus.BAD_REQUEST);
            }
            // check if the post has already been published
            if (post.publish) {
                throw new HttpException("post has already been published", HttpStatus.CONFLICT);
            }
            post.publish = true;
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
     * @param newpost 
     * @returns updates post information
     */
    async unPublishPost(id: string) {
        const res = new ApiResponseDTO<Posts>();
        try {
            const post = await this.postRepository.findOneBy({
                id: id,
            });
            // check if post doesn't exist or have already an email
            if (post === undefined || post === null) {
                throw new HttpException("post doesn't exists", HttpStatus.BAD_REQUEST);
            }
            // check if the post has already been unpublished
            if (!post.publish) {
                throw new HttpException("this post is not published", HttpStatus.CONFLICT);
            }
            post.publish = false;
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

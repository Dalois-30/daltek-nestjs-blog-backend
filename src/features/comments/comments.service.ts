import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comments } from './models/comments.model';
import { Repository } from 'typeorm';
import { Posts } from '../posts/models/posts.model';
import { User } from 'src/auth/entities/user.entity';
import { CommentsAddDto } from './dto/comment-add-dto';
import { ApiResponseDTO } from 'src/shared/response/api-response';

@Injectable()
export class CommentsService {

    constructor(
        @InjectRepository(Comments)
        private readonly commentsRepository: Repository<Comments>,
        @InjectRepository(Posts)
        private readonly postsRepository: Repository<Posts>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) { }

    /**
     * 
     * @param comment the comment object to create
     * @returns 
     */
    async create(comment: CommentsAddDto){
        const res = new ApiResponseDTO<Comments>();
        try {
            // get the user
            const user = await this.userRepository.findOneBy({
                id: comment.user
            });
            if (!user) {
                throw new HttpException("user does'nt exist", HttpStatus.NOT_FOUND);
            }
            // get the corresponding post
            const post = await this.postsRepository.findOneBy({
                id: comment.post
            });
            if (!post) {
                throw new HttpException("post does'nt exist", HttpStatus.NOT_FOUND);
            }
            const newComment = this.commentsRepository.create({
                content: comment.content,
                user: user,
                post: post,
            })
            // check if the comment has a parent 
            if (comment.parent) {
                const parentComment = await this.commentsRepository.findOneBy({
                    id: comment.parent
                });
                if (!parentComment) {
                    throw new HttpException("parent comment does'nt exist", HttpStatus.NOT_FOUND);
                }
                newComment.parent = parentComment;
            }
            // save the new comment
            const result = await this.commentsRepository.save(newComment);
            // return the new comment
            res.data = result;
            res.message = "successfully saved new comment";
            res.statusCode = HttpStatus.CREATED;
            
        } catch (error) {
            res.message = error.message;
            res.statusCode = HttpStatus.BAD_REQUEST;
        }
        return res;
    }
    /**
     * 
     * @param postUuid the post identifier
     * @returns the list of comments of the post
     */
    async getPostComment(postUuid: string){
        const res = new ApiResponseDTO<Comments[]>();
        try {
            // get the corresponding post
            const post = await this.postsRepository.findOneBy({
                id: postUuid
            });
            if (!post) {
                throw new HttpException("post does'nt exist", HttpStatus.NOT_FOUND);
            }
            // get all the comments of the post
            const comments = await this.commentsRepository.createQueryBuilder('comment')
                .leftJoinAndSelect('comment.user', 'user')
                .addSelect(['user.role', 'user.email'])
                .leftJoin('comment.post', 'post')
                .where('post.id = :id', {id: postUuid})
                .getMany();

            // return the new comment
            res.data = comments;
            res.message = "successfully get comments";
            res.statusCode = HttpStatus.OK;
            
        } catch (error) {
            res.message = error.message;
            res.statusCode = HttpStatus.BAD_REQUEST;
        }
        return res;
    }
}

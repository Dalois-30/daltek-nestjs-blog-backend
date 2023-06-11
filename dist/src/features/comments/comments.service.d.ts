import { Comments } from './models/comments.model';
import { Repository } from 'typeorm';
import { Posts } from '../posts/models/posts.model';
import { User } from 'src/auth/entities/user.entity';
import { CommentsAddDto } from './dto/comment-add-dto';
import { ApiResponseDTO } from 'src/shared/response/api-response';
export declare class CommentsService {
    private readonly commentsRepository;
    private readonly postsRepository;
    private readonly userRepository;
    constructor(commentsRepository: Repository<Comments>, postsRepository: Repository<Posts>, userRepository: Repository<User>);
    create(comment: CommentsAddDto): Promise<ApiResponseDTO<Comments>>;
    getPostComment(postUuid: string): Promise<ApiResponseDTO<Comments[]>>;
}

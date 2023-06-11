import { CommentsService } from './comments.service';
import { CommentsAddDto } from './dto/comment-add-dto';
export declare class CommentsController {
    private readonly commentsService;
    constructor(commentsService: CommentsService);
    createUser(comment: CommentsAddDto): Promise<{
        data?: import("./models/comments.model").Comments;
        message?: any;
        statusCode?: number;
    }>;
    getPostComment(postUiid: string): Promise<{
        data?: import("./models/comments.model").Comments[];
        message?: any;
        statusCode?: number;
    }>;
}

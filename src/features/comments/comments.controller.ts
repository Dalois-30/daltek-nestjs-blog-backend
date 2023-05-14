import { Body, Controller, Post } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsAddDto } from './dto/comment-add-dto';
import { ApiTags, ApiResponse } from '@nestjs/swagger';


@ApiTags('comments')
@Controller('comments')
export class CommentsController {
    constructor(
        private readonly commentsService: CommentsService
    ){}

    @ApiResponse({ status: 201, description: 'Successfully add comment' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @Post('/add-comment')
    async createUser(@Body() comment: CommentsAddDto) {
      const response = await this.commentsService.create(comment);
      return {
        ...response,
      };
    }
}

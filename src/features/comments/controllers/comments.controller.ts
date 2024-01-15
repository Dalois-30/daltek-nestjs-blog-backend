import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CommentsService } from '../services/comments.service';
import { CommentsAddDto } from '../dto/comment-add-dto';
import { ApiTags, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';


@ApiBearerAuth('JWT-auth')
@ApiTags('comments')
@Controller('comments')
export class CommentsController {
  constructor(
    private readonly commentsService: CommentsService
  ) { }

  @ApiResponse({ status: 201, description: 'Successfully add comment' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @Post('/add-comment')
  async createUser(@Body() comment: CommentsAddDto) {
    const response = await this.commentsService.create(comment);
    return {
      ...response,
    };
  }

  @ApiResponse({ status: 201, description: 'Successfully add comment' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @Get('/')
  async getPostComment(@Query('postId') postUiid: string) {
    const response = await this.commentsService.getPostComment(postUiid);
    return {
      ...response,
    };
  }
}

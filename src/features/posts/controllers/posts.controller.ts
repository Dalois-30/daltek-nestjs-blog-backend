import { Body, Controller, Delete, Get, Param, ParseFilePipe, ParseUUIDPipe, Post, Put, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { CreatePostDto, UpdatePostDto } from '../dto/create-post-dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiResponse, ApiConsumes, ApiBody, ApiTags, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { UploadService } from 'src/shared/upload/upload.service';
import { PostsService } from '../services/posts.service';
import { ApiResponseDTO } from 'src/shared/response/api-response';
import { PostGetDTO } from '../dto/post-get-dto';
import { Public } from 'src/auth/decorators/public.decorator';
import { log } from 'console';

@ApiBearerAuth('JWT-auth')
@ApiTags('posts')
@Controller('posts')
export class PostsController {
  constructor(
    private postService: PostsService,
    private readonly uploadService: UploadService
  ) { }


  /**
   * 
   * @returns the list of post
   */
  @Public()
  @ApiResponse({ status: 200, description: 'Fetched all post' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @Get("/get-all")
  async getAllpost(@Query('page') page: number = 0, @Query('limit') limit: number = 10) {
    return await this.postService.findAll(page, limit);
  }

  /**
   * 
   * @returns the list of post
   */
  @Public()
  @ApiResponse({ status: 200, description: 'Fetched all post' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @Get("/get-all-published")
  async getAllpostPublished(@Query('page') page: number = 0, @Query('limit') limit: number = 10) {
    return await this.postService.findAllPublished(page, limit);
  }


  /**
   * 
   * @param post 
   * @returns the newly created post
   */
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        content: { type: 'string' },
        parent: { type: 'string' },
        tags: { type: 'string' },
        author: { type: 'string' },
        category: { type: 'string' },
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Create new post' })
  @Post('/create')
  @UseInterceptors(FileInterceptor('file'))
  async createpost(@UploadedFile(
    new ParseFilePipe({
      validators: [
        // new MaxFileSizeValidator({ maxSize: 6000 }),
        // new FileTypeValidator({ fileType: 'image/jpeg' })
      ]
    })
  ) file: Express.Multer.File, @Body() post: CreatePostDto) {
    // const link = await this.uploadService.upload(file.originalname, file.buffer);
    log("in the post controller");
    return await this.postService.create(post, file);
  }


  /**
   * 
   * @param id 
   * @returns one or more post
   */
  @Public()
  @ApiResponse({ status: 200, description: 'Fetched specific post' })
  @Get('/getOne/:postId')
  async getpostById(@Param('postId') id: string): Promise<ApiResponseDTO<PostGetDTO>> {
    return await this.postService.findOneById(id);
  }



  //   /**
  //    * 
  //    * @param id 
  //    * @returns delete one post in the database
  //    */
  //   @ApiResponse({ status: 200, description: 'Deleted specific post' })
  //   @Delete('/delete/:postId')
  //   async deletepostById(@Param('postId') id: string) {
  //     return await this.postService.delete(id);
  //   }


  // /**
  //  * 
  //  * @param id 
  //  * @param post 
  //  * @returns update post information
  //  */
  // @ApiResponse({ status: 200, description: 'Fetched all post' })
  // @ApiResponse({ status: 400, description: 'post not found' })
  // @Put('/update/:postId')
  // async updatepost(@Param('postId', new ParseUUIDPipe({ version: '4' })) id: string, @Body() post: UpdatePostDto) {
  //   return await this.postService.update(id, post);
  // }

  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        content: { type: 'string' },
        tags: { type: '[string]' },
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Update post' })
  @Put('/update/:postId')
  @UseInterceptors(FileInterceptor('file'))
  async updatepost(@Param('postId', new ParseUUIDPipe({ version: '4' })) id: string, @UploadedFile(
    new ParseFilePipe({
      validators: [
        // new MaxFileSizeValidator({ maxSize: 6000 }),
        // new FileTypeValidator({ fileType: 'image/jpeg' })
      ]
    })
  ) file: Express.Multer.File, @Body() newPost: UpdatePostDto) {
    return await this.postService.update(id, newPost, file);
  }

  /**
   * 
   * @param id 
   * @param post 
   * @returns update post information
   */
  @ApiResponse({ status: 200, description: 'Fetched all post' })
  @ApiResponse({ status: 400, description: 'post not found' })
  @Put('/publish/:postId')
  async publish(@Param('postId', new ParseUUIDPipe({ version: '4' })) id: string) {
    return await this.postService.publishPost(id);
  }
  /**
   * 
   * @param id 
   * @param post 
   * @returns update post information
   */
  @ApiResponse({ status: 200, description: 'Fetched all post' })
  @ApiResponse({ status: 400, description: 'post not found' })
  @Put('/unpublish/:postId')
  async unpublish(@Param('postId', new ParseUUIDPipe({ version: '4' })) id: string) {
    return await this.postService.unPublishPost(id);
  }
}

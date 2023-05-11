import { Body, Controller, Delete, Get, Param, ParseFilePipe, Post, Put, UploadedFile, UseInterceptors } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post-dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiResponse, ApiConsumes, ApiBody, ApiTags } from '@nestjs/swagger';
import { UploadService } from 'src/shared/upload/upload.service';
import { PostsService } from './posts.service';
import { Posts } from './models/posts.model';

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
      @ApiResponse({ status: 200, description: 'Fetched all post' })
      @Get()
      async getAllpost(): Promise<Posts[]> {
        return await this.postService.findAll();
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
            name: { type: 'string' },
            description: { type: 'string' },
            parent: { type: 'string' },
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
      ) file: Express.Multer.File, @Body() post: CreatePostDto): Promise<Posts> {
        const link = await this.uploadService.upload(file.originalname, file.buffer);
        return await this.postService.create(post, link);
      }
      /**
       * 
       * @param id 
       * @returns one or more post
       */
      @ApiResponse({ status: 200, description: 'Fetched specific post' })
      @Get('/getOne/:postId')
      async getpostById(@Param('postId') id: string): Promise<Posts> {
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
      /**
       * 
       * @param id 
       * @param post 
       * @returns update post information
       */
      @ApiResponse({ status: 200, description: 'Fetched all post' })
      @ApiResponse({ status: 400, description: 'post not found' })
      @Put('/update/:postId')
      async updatepost(@Param('postId') id: string, @Body() post: CreatePostDto) {
        return await this.postService.update(id, post);
      }
}

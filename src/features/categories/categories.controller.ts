
import { Body, Controller, Delete, Get, Param, ParseFilePipe, Post, Put, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ApiTags, ApiResponse, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { CreateCategoryDto } from './dto/category-create-dto';
import { CategoriesService } from './categories.service';
import { Category } from './models/category.model';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from 'src/shared/upload/upload.service';

@ApiTags('categories')
@Controller('category')
export class CategoriesController {
  constructor(
    private categoryService: CategoriesService,
    private readonly uploadService: UploadService
  ) { }
  /**
   * 
   * @returns the list of Category
   */
  @ApiResponse({ status: 200, description: 'Fetched all category' })
  @Get()
  async getAllCategory(): Promise<Category[]> {
    return await this.categoryService.findAll();
  }
  /**
   * 
   * @param category 
   * @returns the newly created category
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
  @ApiResponse({ status: 200, description: 'Create new category' })
  @Post('/create')
  @UseInterceptors(FileInterceptor('file'))
  async createCategory(@UploadedFile(
    new ParseFilePipe({
      validators: [
        // new MaxFileSizeValidator({ maxSize: 6000 }),
        // new FileTypeValidator({ fileType: 'image/jpeg' })
      ]
    })
  ) file: Express.Multer.File, @Body() category: CreateCategoryDto) {
    const link = await this.uploadService.upload(file.originalname, file.buffer);
    return await this.categoryService.create(category, link);
  }
  /**
   * 
   * @param id 
   * @returns one or more category
   */
  @ApiResponse({ status: 200, description: 'Fetched specific category' })
  @Get('/getOne/:categoryId')
  async getCategoryById(@Param('categoryId') id: string): Promise<Category> {
    return await this.categoryService.findOneById(id);
  }
  /**
   * 
   * @param id 
   * @returns delete one category in the database
   */
  @ApiResponse({ status: 200, description: 'Deleted specific category' })
  @Delete('/delete/:categoryId')
  async deleteCategoryById(@Param('categoryId') id: string) {
    return await this.categoryService.delete(id);
  }
  /**
   * 
   * @param id 
   * @param category 
   * @returns update category information
   */
  @ApiResponse({ status: 200, description: 'Fetched all Category' })
  @ApiResponse({ status: 400, description: 'category not found' })
  @Put('/update/:categoryId')
  async updateCategory(@Param('categoryId') id: string, @Body() category: CreateCategoryDto) {
    return await this.categoryService.update(id, category);
  }
}

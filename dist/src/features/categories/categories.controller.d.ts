/// <reference types="multer" />
import { CreateCategoryDto } from './dto/category-create-dto';
import { CategoriesService } from './categories.service';
import { Category } from './models/category.model';
import { ApiResponseDTO } from 'src/shared/response/api-response';
import { CategoryGetDTO, CategoryGetDetailDTO } from './dto/category-get-dto';
export declare class CategoriesController {
    private categoryService;
    constructor(categoryService: CategoriesService);
    getAllCategory(page?: number, limit?: number): Promise<{
        totalItems: number;
        currentPage: number;
        pageCount: number;
        data?: CategoryGetDTO[];
        message?: any;
        statusCode?: number;
    }>;
    createCategory(file: Express.Multer.File, category: CreateCategoryDto): Promise<ApiResponseDTO<Category>>;
    getCategoryById(id: string): Promise<ApiResponseDTO<CategoryGetDetailDTO>>;
    deleteCategoryById(id: string): Promise<ApiResponseDTO<Category>>;
    updateCategory(id: string, category: CreateCategoryDto): Promise<ApiResponseDTO<Category>>;
}

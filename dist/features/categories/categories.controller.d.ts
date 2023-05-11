/// <reference types="multer" />
import { CreateCategoryDto } from './dto/category-create-dto';
import { CategoriesService } from './categories.service';
import { Category } from './models/category.model';
import { UploadService } from 'src/shared/upload/upload.service';
export declare class CategoriesController {
    private categoryService;
    private readonly uploadService;
    constructor(categoryService: CategoriesService, uploadService: UploadService);
    getAllCategory(): Promise<Category[]>;
    createCategory(file: Express.Multer.File, category: CreateCategoryDto): Promise<import("../../shared/response/api-response").ApiResponse<Category>>;
    getCategoryById(id: string): Promise<Category>;
    deleteCategoryById(id: string): Promise<import("typeorm").DeleteResult>;
    updateCategory(id: string, category: CreateCategoryDto): Promise<Category>;
}

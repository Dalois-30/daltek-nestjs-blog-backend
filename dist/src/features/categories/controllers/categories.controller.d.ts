/// <reference types="multer" />
import { CreateCategoryDto } from '../dto/category-create-dto';
import { CategoriesService } from '../services/categories.service';
export declare class CategoriesController {
    private categoryService;
    constructor(categoryService: CategoriesService);
    getAllCategory(page?: number, limit?: number): Promise<{
        totalItems: number;
        currentPage: number;
        pageCount: number;
        data?: import("../dto/category-get-dto").CategoryGetDTO[];
        message?: any;
        statusCode?: number;
    }>;
    createCategory(file: Express.Multer.File, category: CreateCategoryDto): Promise<import("../../../shared/response/api-response").ApiResponseDTO<import("../models/category.model").Category>>;
    getCategoryById(id: string): Promise<import("../../../shared/response/api-response").ApiResponseDTO<import("../dto/category-get-dto").CategoryGetDTO>>;
    deleteCategoryById(id: string): Promise<import("../../../shared/response/api-response").ApiResponseDTO<import("../models/category.model").Category>>;
    updateCategory(id: string, category: CreateCategoryDto): Promise<import("../../../shared/response/api-response").ApiResponseDTO<import("../models/category.model").Category>>;
}

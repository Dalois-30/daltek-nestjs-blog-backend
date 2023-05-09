import { CreateCategoryDto } from './dto/category-create-dto';
import { CategoriesService } from './categories.service';
import { Category } from './models/category.model';
export declare class CategoriesController {
    private categoryService;
    constructor(categoryService: CategoriesService);
    getAllCategory(): Promise<Category[]>;
    createCategory(category: CreateCategoryDto): Promise<Category>;
    getCategoryById(id: string): Promise<Category>;
    deleteCategoryById(id: string): Promise<import("typeorm").DeleteResult>;
    updateCategory(id: string, category: CreateCategoryDto): Promise<Category>;
}

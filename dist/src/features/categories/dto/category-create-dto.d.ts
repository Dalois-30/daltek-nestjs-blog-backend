import { Category } from '../models/category.model';
export declare class CreateCategoryDto {
    name: string;
    description: string;
    parent?: string;
}
export declare class CategoryWithParent {
    name: string;
    description: string;
    parent?: Category;
}

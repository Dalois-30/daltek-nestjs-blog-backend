import { Category } from '../models/category.model';
export declare class CreateCategoryDto {
    name: string;
    description: string;
    parent?: string;
}
export interface CategoryWithParent {
    name: string;
    description: string;
    parent?: Category;
}

import { Category } from '../models/category.model';
export declare class CategoryGetDTO {
    cat: CategoryDto;
    image?: string;
}
export declare class CategoryGetDetailDTO {
    cat: Category;
    image?: string;
}
export declare class CategoryDto {
    id: string;
    name: string;
    description: string;
    image: string;
    parent: Category;
    children: Category[];
    created_at: Date;
    updated_at: Date;
    posts: number;
}

import { Category } from "src/features/categories/models/category.model";
export declare class Post {
    id: string;
    title: string;
    content: string;
    images: string;
    stattus: boolean;
    tags: string;
    category: Category;
    created_at: Date;
    updated_at: Date;
}

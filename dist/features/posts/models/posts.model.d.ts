import { User } from "src/auth/entities/user.entity";
import { Category } from "src/features/categories/models/category.model";
export declare class Posts {
    id: string;
    title: string;
    content: string;
    image: string;
    status: boolean;
    tags?: string;
    category: Category;
    user: User;
    comments: Comment[];
    created_at: Date;
    updated_at: Date;
}

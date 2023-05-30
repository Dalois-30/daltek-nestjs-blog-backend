import { User } from "src/auth/entities/user.entity";
import { Category } from "src/features/categories/models/category.model";
import { Comments } from "src/features/comments/models/comments.model";
export declare class Posts {
    id: string;
    title: string;
    content: string;
    image: string;
    status: boolean;
    tags?: string;
    category: Category;
    user: User;
    comments: Comments[];
    created_at: Date;
    updated_at: Date;
}

import { Posts } from "src/features/posts/models/posts.model";
export declare class Category {
    id: string;
    name: string;
    description: string;
    image: string;
    parent: Category;
    children: Category[];
    posts: Posts[];
    created_at: Date;
    updated_at: Date;
}

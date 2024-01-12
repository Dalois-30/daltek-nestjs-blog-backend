import { Posts } from '../models/posts.model';
import { Category } from 'src/features/categories/models/category.model';
export declare class PostObjectToSendWithImage {
    post: PostObjectToSendDTO;
    image?: string;
}
export declare class PostGetDTO {
    post: Posts;
    image?: string;
}
export declare class PostObjectToSendDTO {
    id: string;
    title: string;
    content: string;
    publish: boolean;
    tags?: string;
    category: Category;
    user: string;
    comments: number;
    created_at: Date;
    updated_at: Date;
}

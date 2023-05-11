import { User } from "src/auth/entities/user.entity";
import { Posts } from "src/features/posts/models/posts.model";
export declare class Comments {
    id: string;
    name: string;
    description: string;
    image: string;
    user: User;
    post: Posts[];
    parent: Comments;
    children: Comments[];
    created_at: Date;
    updated_at: Date;
}

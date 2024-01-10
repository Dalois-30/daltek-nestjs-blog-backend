import { Comments } from 'src/features/comments/models/comments.model';
import { Posts } from 'src/features/posts/models/posts.model';
import { Role } from 'src/features/role/entities/role.entity';
export declare class User {
    id: string;
    email: string;
    username: string;
    password: string;
    comments: Comments[];
    posts: Posts[];
    verified: boolean;
    userRoles: Role[];
    hashPassword(): Promise<void>;
    created_at: Date;
    updated_at: Date;
}

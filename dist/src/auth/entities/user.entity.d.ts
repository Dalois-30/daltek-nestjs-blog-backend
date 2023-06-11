import { UserRoles } from '../constant/user-roles';
import { Comments } from 'src/features/comments/models/comments.model';
import { Posts } from 'src/features/posts/models/posts.model';
export declare class User {
    id: string;
    email: string;
    username: string;
    password: string;
    comments: Comments[];
    posts: Posts[];
    verified: boolean;
    role: UserRoles;
    hashPassword(): Promise<void>;
    created_at: Date;
    updated_at: Date;
}

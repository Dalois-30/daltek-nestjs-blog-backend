import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';
import { Posts } from '../models/posts.model';
import { Category } from 'src/features/categories/models/category.model';
import { User } from 'src/auth/entities/user.entity';

export class PostObjectToSendWithImage {
    post: PostObjectToSendDTO;
    image?: string;
}
export class PostGetDTO {
    post: Posts;
    image?: string;
}

// export class AllPostsGetDTO {
//     post: Posts;
//     image?: string;
//     comments?: number;
// }

export class PostObjectToSendDTO {
    id: string;
    title: string;
    content: string;
    status: boolean;
    tags?: string;
    category: Category;
    user: string;
    comments: number;
    created_at: Date;
    updated_at: Date;
}
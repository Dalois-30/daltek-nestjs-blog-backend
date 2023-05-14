import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';
import { Posts } from '../models/posts.model';

export class PostGetDTO {
    post: Posts;
    image?: string;
}
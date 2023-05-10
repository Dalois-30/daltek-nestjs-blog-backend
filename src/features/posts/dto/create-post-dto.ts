import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreatePostDto {
    title: string;
    content: string;
    image: string;
    status: boolean;
    tags: string;
    category: string;
} 

export class UpdatePostDto {
    title?: string;
    content?: string;
    image?: string;
    status?: boolean;
    tags?: string;
} 
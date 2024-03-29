import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreatePostDto {
    title: string;
    content: string;
    tags?: string;
    category: string;
    author: string;
}

export class UpdatePostDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    title?: string;
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    content?: string;
    @ApiProperty()
    tags?: string;
} 
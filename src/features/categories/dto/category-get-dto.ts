import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';
import { Category } from '../models/category.model';

export class CategoryGetDTO {
    cat: CategoryDto;
    image?: string;
}

export class CategoryGetDetailDTO {
    cat: Category;
    image?: string;
}

export class CategoryDto {
    id: string;
    name: string;
    description: string;
    image: string;
    parent: Category;
    children: Category[];
    created_at: Date;
    updated_at: Date;
    posts: number;
}
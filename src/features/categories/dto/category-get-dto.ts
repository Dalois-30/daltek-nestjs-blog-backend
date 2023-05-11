import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';
import { Category } from '../models/category.model';

export class CategoryGetDTO {
    cat: Category;
    image?: string;
}
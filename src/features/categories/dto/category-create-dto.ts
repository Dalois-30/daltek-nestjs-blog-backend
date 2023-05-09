import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';
import { Category } from '../models/category.model';

export class CreateCategoryDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public name: string;
  
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public description: string;
  
  @ApiProperty()
  public parent?: string;
}


export interface CategoryWithParent{
  name: string;
  description: string;
  parent?: Category;
}

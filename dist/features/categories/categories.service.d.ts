import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/category-create-dto';
import { Category } from './models/category.model';
import { ApiResponse } from 'src/shared/response/api-response';
export declare class CategoriesService {
    private readonly categoryRepository;
    constructor(categoryRepository: Repository<Category>);
    create(category: CreateCategoryDto, image: string): Promise<ApiResponse<Category>>;
    findAll(): Promise<Category[]>;
    findOneById(id: string): Promise<Category>;
    update(id: string, newCatDto: CreateCategoryDto): Promise<Category>;
    delete(id: string): Promise<import("typeorm").DeleteResult>;
}

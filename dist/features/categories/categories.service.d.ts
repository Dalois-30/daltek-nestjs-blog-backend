/// <reference types="multer" />
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/category-create-dto';
import { Category } from './models/category.model';
import { UploadService } from 'src/shared/upload/upload.service';
import { ApiResponseDTO } from 'src/shared/response/api-response';
import { CategoryGetDTO } from './dto/category-get-dto';
export declare class CategoriesService {
    private readonly categoryRepository;
    private readonly uploadService;
    constructor(categoryRepository: Repository<Category>, uploadService: UploadService);
    create(category: CreateCategoryDto, file: Express.Multer.File): Promise<ApiResponseDTO<Category>>;
    findAll(): Promise<ApiResponseDTO<CategoryGetDTO[]>>;
    findOneById(id: string): Promise<ApiResponseDTO<Category>>;
    update(id: string, newCatDto: CreateCategoryDto): Promise<ApiResponseDTO<Category>>;
    delete(id: string): Promise<ApiResponseDTO<Category>>;
}

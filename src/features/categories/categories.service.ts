import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryWithParent, CreateCategoryDto } from './dto/category-create-dto';
import { Category } from './models/category.model';
import { ApiResponse } from 'src/shared/response/api-response';

@Injectable()
export class CategoriesService {
    constructor(
        @InjectRepository(Category)
        private readonly categoryRepository: Repository<Category>,

    ) { }

    /**
     * 
     * @param type type dta 
     * @returns the type object newly created
     */
    async create(category: CreateCategoryDto, image: string) {
        const newCat = this.categoryRepository.create({
            name: category.name,
            description: category.description,
            image: image
        });
        if (category.parent) {
            // get the parent category
            const parent = await this.categoryRepository.findOneBy({
                id: category.parent
            })
            // check if the parent category exist
            if (!parent) {
                throw new HttpException("category parent not found", HttpStatus.BAD_REQUEST);
            }
            newCat.parent = parent;
        }
        const result = await this.categoryRepository.save(newCat);
        const res = new ApiResponse<Category>();
        res.data = result;
        res.message = "successfully created category"
        res.success = true;
        return res;
    }
    /**
     * 
     * @returns the list of all types
     */
    async findAll(): Promise<Category[]> {
        return await this.categoryRepository.find();
    }
    /**
     * 
     * @param id the id of the type
     * @returns the type object based on the id
     */
    async findOneById(id: string): Promise<Category> {
        // get the category
        const category = await this.categoryRepository.findOne({
            where: {
                id: id
            },
            relations: {
                parent: true,
                children: true,
            },
        });
        // check if the category exists
        if (!category) {
            throw new HttpException("category not found", HttpStatus.BAD_REQUEST);
        }
        return category;
    }
    /**
     * 
     * @param id id of the type to update
     * @param newType attributes of the new type
     * @returns the updated type
     */
    async update(id: string, newCatDto: CreateCategoryDto): Promise<Category> {
        // first get the type
        const catGet = await this.categoryRepository.findOneBy({ id });
        // then check if it's undefined
        if (!catGet) {
            throw new HttpException("category not found", HttpStatus.BAD_REQUEST);
        }
        let newCat!: CategoryWithParent;
        newCat.description = newCatDto.description;
        newCat.name = newCatDto.name;
        // check if the parent category is present
        if (newCatDto.parent) {
            const parent = await this.categoryRepository.findOneBy({
                id: newCatDto.parent
            })
            // check if the parent category exist
            if (!parent) {
                throw new HttpException("category parent not found", HttpStatus.BAD_REQUEST);
            }
            // set the new Cat
            newCat.parent = parent
        }
        // then update the type
        this.categoryRepository.merge(catGet, newCat);  
        return await this.categoryRepository.save(catGet);
    }

    async delete(id: string) {
        // get first the type
        const type = await this.categoryRepository.findOneBy({ id });
        // check if it's exists
        if (!type) {
            throw new HttpException("Type doesn't exists", HttpStatus.BAD_REQUEST);
        }
        // delete
        return await this.categoryRepository.delete(id);
    }


}

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryWithParent, CreateCategoryDto } from './dto/category-create-dto';
import { Category } from './models/category.model';
import { UploadService } from 'src/shared/upload/upload.service';
import { ApiResponseDTO } from 'src/shared/response/api-response';
import { Request as RequestExpress, Response } from 'express';
import { CategoryDto, CategoryGetDTO, CategoryGetDetailDTO } from './dto/category-get-dto';
import { GetFileDto } from 'src/shared/upload/get-file-dto';

@Injectable()
export class CategoriesService {
    constructor(
        @InjectRepository(Category)
        private readonly categoryRepository: Repository<Category>,
        private readonly uploadService: UploadService

    ) { }

    /**
     * 
     * @param type type dta 
     * @returns the type object newly created
     */
    async create(category: CreateCategoryDto, file: Express.Multer.File) {
        const res = new ApiResponseDTO<Category>();
        try {
            // upload image file and get key
            const image = await this.uploadService.upload(file.originalname, file.buffer);
            // create a new category
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
            // save the category
            const result = await this.categoryRepository.save(newCat);
            // format response
            res.data = result;
            res.message = "successfully created category"
            res.statusCode = HttpStatus.CREATED

        } catch (error) {
            res.message = error.message;
            res.statusCode = HttpStatus.BAD_REQUEST
        }
        return res;

    }
    /**
     * 
     * @returns the list of all types
     */
    async findAll(page?: number, limit?: number) {
        const res = new ApiResponseDTO<CategoryGetDTO[]>();
        let totalGet = 0;
        try {
            let [result, total] = await this.categoryRepository.createQueryBuilder('category')
                .leftJoinAndSelect('category.parent', 'parent')
                .leftJoinAndSelect('category.children', 'children')
                .leftJoinAndSelect('category.posts', 'posts.id')
                .skip(page * limit)
                .take(limit)
                .getManyAndCount();
            totalGet = total;

            // return only the parent category
            result = result.filter(element => element.parent == undefined);
            // create an object of the type catget to retria
            let catsGet: CategoryGetDTO[] = [];

            for (let index = 0; index < result.length; index++) {
                const cat = result[index];
                let catGet = new CategoryGetDTO();
                let urlObj = new GetFileDto();
                urlObj.key = cat.image;
                // get the signed link of the file
                let img = await this.uploadService.getUploadedObject(urlObj)
                // set the object 
                let catDto = new CategoryDto();
                catDto.id = cat.id;
                catDto.name = cat.name;
                catDto.parent = cat.parent;
                catDto.children = cat.children;
                catDto.created_at = cat.created_at;
                catDto.description = cat.description;
                catDto.posts = cat.posts.length;
                catDto.updated_at = cat.updated_at;

                catGet.cat = catDto;
                catGet.image = img;
                // updatte the table of cat with the signed link
                catsGet.push(catGet);
                console.log(catsGet.length);
            }

            res.data = catsGet
            res.message = "success";
            res.statusCode = HttpStatus.OK;
        } catch (error) {
            res.statusCode = HttpStatus.BAD_REQUEST;
            res.message = error.message
        }
        return {
            ...res,
            totalItems: totalGet,
            currentPage: page,
            pageCount: Math.ceil(totalGet / limit),
        }
    }
    /**
     * 
     * @param id the id of the type
     * @returns the type object based on the id
     */
    async findOneById(id: string): Promise<ApiResponseDTO<CategoryGetDetailDTO>> {
        const res = new ApiResponseDTO<CategoryGetDetailDTO>();
        try {
            // get the category
            const category = await this.categoryRepository.findOne({
                where: {
                    id: id
                },
                relations: {
                    parent: true,
                    children: true,
                    posts: true
                },
            });
            // check if the category exists
            if (!category) {
                throw new HttpException("category not found", HttpStatus.BAD_REQUEST);
            }
            let catGet = new CategoryGetDetailDTO();
                let urlObj = new GetFileDto();
                urlObj.key = category.image;
                // get the signed link of the file
                let img = await this.uploadService.getUploadedObject(urlObj)
                // set the object 
                catGet.cat = category;
                catGet.image = img;
            res.data = catGet
            res.message = "success";
            res.statusCode = HttpStatus.OK;
        } catch (error) {
            res.statusCode = HttpStatus.BAD_REQUEST;
            res.message = error.message
        }

        return res;
    }
    /**
     * 
     * @param id id of the type to update
     * @param newType attributes of the new type
     * @returns the updated type
     */
    async update(id: string, newCatDto: CreateCategoryDto): Promise<ApiResponseDTO<Category>> {
        const res = new ApiResponseDTO<Category>();
        try {
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
            const result = await this.categoryRepository.save(catGet);
            res.data = result
            res.message = "success";
            res.statusCode = HttpStatus.OK;
        } catch (error) {
            res.statusCode = HttpStatus.BAD_REQUEST;
            res.message = error.message
        }
        return res;
    }
    /**
     * 
     * @param id the id of the category to delete
     * @returns 
     */
    async delete(id: string) {
        const res = new ApiResponseDTO<Category>();
        try {
            // get first the type
            const type = await this.categoryRepository.findOneBy({ id });
            // check if it's exists
            if (!type) {
                throw new HttpException("Type doesn't exists", HttpStatus.BAD_REQUEST);
            }
            // delete
            await this.categoryRepository.delete(id);
            res.statusCode = HttpStatus.OK;
            res.message = "Category deleted successfully"
        } catch (error) {
            res.statusCode = HttpStatus.BAD_REQUEST;
            res.message = error.message
        }
        return res;
    }


}

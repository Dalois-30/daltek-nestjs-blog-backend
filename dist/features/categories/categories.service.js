"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoriesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const category_model_1 = require("./models/category.model");
const upload_service_1 = require("../../shared/upload/upload.service");
const api_response_1 = require("../../shared/response/api-response");
const category_get_dto_1 = require("./dto/category-get-dto");
const get_file_dto_1 = require("../../shared/upload/get-file-dto");
let CategoriesService = class CategoriesService {
    constructor(categoryRepository, uploadService) {
        this.categoryRepository = categoryRepository;
        this.uploadService = uploadService;
    }
    async create(category, file) {
        const res = new api_response_1.ApiResponseDTO();
        try {
            const image = await this.uploadService.upload(file.originalname, file.buffer);
            const newCat = this.categoryRepository.create({
                name: category.name,
                description: category.description,
                image: image
            });
            if (category.parent) {
                const parent = await this.categoryRepository.findOneBy({
                    id: category.parent
                });
                if (!parent) {
                    throw new common_1.HttpException("category parent not found", common_1.HttpStatus.BAD_REQUEST);
                }
                newCat.parent = parent;
            }
            const result = await this.categoryRepository.save(newCat);
            res.data = result;
            res.message = "successfully created category";
            res.statusCode = common_1.HttpStatus.CREATED;
        }
        catch (error) {
            res.message = error.message;
            res.statusCode = common_1.HttpStatus.BAD_REQUEST;
        }
        return res;
    }
    async findAll() {
        const res = new api_response_1.ApiResponseDTO();
        try {
            let result = await this.categoryRepository.find({
                relations: {
                    parent: true,
                    children: true,
                },
            });
            result = result.filter(element => element.parent == undefined);
            let catsGet = [];
            for (let index = 0; index < result.length; index++) {
                const cat = result[index];
                let catGet = new category_get_dto_1.CategoryGetDTO();
                let urlObj = new get_file_dto_1.GetFileDto();
                urlObj.key = cat.image;
                let img = await this.uploadService.getUploadedObject(urlObj);
                catGet.cat = cat;
                catGet.image = img;
                catsGet.push(catGet);
                console.log(catsGet.length);
            }
            res.data = catsGet;
            res.message = "success";
            res.statusCode = common_1.HttpStatus.OK;
        }
        catch (error) {
            res.statusCode = common_1.HttpStatus.BAD_REQUEST;
            res.message = error.message;
        }
        return res;
    }
    async findOneById(id) {
        const res = new api_response_1.ApiResponseDTO();
        try {
            const category = await this.categoryRepository.findOne({
                where: {
                    id: id
                },
                relations: {
                    parent: true,
                    children: true,
                },
            });
            if (!category) {
                throw new common_1.HttpException("category not found", common_1.HttpStatus.BAD_REQUEST);
            }
            res.data = category;
            res.message = "success";
            res.statusCode = common_1.HttpStatus.OK;
        }
        catch (error) {
            res.statusCode = common_1.HttpStatus.BAD_REQUEST;
            res.message = error.message;
        }
        return res;
    }
    async update(id, newCatDto) {
        const res = new api_response_1.ApiResponseDTO();
        try {
            const catGet = await this.categoryRepository.findOneBy({ id });
            if (!catGet) {
                throw new common_1.HttpException("category not found", common_1.HttpStatus.BAD_REQUEST);
            }
            let newCat;
            newCat.description = newCatDto.description;
            newCat.name = newCatDto.name;
            if (newCatDto.parent) {
                const parent = await this.categoryRepository.findOneBy({
                    id: newCatDto.parent
                });
                if (!parent) {
                    throw new common_1.HttpException("category parent not found", common_1.HttpStatus.BAD_REQUEST);
                }
                newCat.parent = parent;
            }
            this.categoryRepository.merge(catGet, newCat);
            const result = await this.categoryRepository.save(catGet);
            res.data = result;
            res.message = "success";
            res.statusCode = common_1.HttpStatus.OK;
        }
        catch (error) {
            res.statusCode = common_1.HttpStatus.BAD_REQUEST;
            res.message = error.message;
        }
        return res;
    }
    async delete(id) {
        const res = new api_response_1.ApiResponseDTO();
        try {
            const type = await this.categoryRepository.findOneBy({ id });
            if (!type) {
                throw new common_1.HttpException("Type doesn't exists", common_1.HttpStatus.BAD_REQUEST);
            }
            await this.categoryRepository.delete(id);
            res.statusCode = common_1.HttpStatus.OK;
            res.message = "Category deleted successfully";
        }
        catch (error) {
            res.statusCode = common_1.HttpStatus.BAD_REQUEST;
            res.message = error.message;
        }
        return res;
    }
};
CategoriesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(category_model_1.Category)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        upload_service_1.UploadService])
], CategoriesService);
exports.CategoriesService = CategoriesService;
//# sourceMappingURL=categories.service.js.map
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
let CategoriesService = class CategoriesService {
    constructor(categoryRepository) {
        this.categoryRepository = categoryRepository;
    }
    async create(category) {
        const newCat = this.categoryRepository.create({
            name: category.name,
            description: category.description
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
        await this.categoryRepository.save(newCat);
        return newCat;
    }
    async findAll() {
        return await this.categoryRepository.find();
    }
    async findOneById(id) {
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
        return category;
    }
    async update(id, newCatDto) {
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
        return await this.categoryRepository.save(catGet);
    }
    async delete(id) {
        const type = await this.categoryRepository.findOneBy({ id });
        if (!type) {
            throw new common_1.HttpException("Type doesn't exists", common_1.HttpStatus.BAD_REQUEST);
        }
        return await this.categoryRepository.delete(id);
    }
};
CategoriesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(category_model_1.Category)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], CategoriesService);
exports.CategoriesService = CategoriesService;
//# sourceMappingURL=categories.service.js.map
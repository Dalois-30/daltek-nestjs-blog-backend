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
exports.CategoriesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const category_create_dto_1 = require("./dto/category-create-dto");
const categories_service_1 = require("./categories.service");
let CategoriesController = class CategoriesController {
    constructor(categoryService) {
        this.categoryService = categoryService;
    }
    async getAllCategory() {
        return await this.categoryService.findAll();
    }
    async createCategory(category) {
        return await this.categoryService.create(category);
    }
    async getCategoryById(id) {
        return await this.categoryService.findOneById(id);
    }
    async deleteCategoryById(id) {
        return await this.categoryService.delete(id);
    }
    async updateCategory(id, category) {
        return await this.categoryService.update(id, category);
    }
};
__decorate([
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Fetched all category' }),
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CategoriesController.prototype, "getAllCategory", null);
__decorate([
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Create new category' }),
    (0, common_1.Post)('/create'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [category_create_dto_1.CreateCategoryDto]),
    __metadata("design:returntype", Promise)
], CategoriesController.prototype, "createCategory", null);
__decorate([
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Fetched specific category' }),
    (0, common_1.Get)('/getOne/:categoryId'),
    __param(0, (0, common_1.Param)('categoryId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CategoriesController.prototype, "getCategoryById", null);
__decorate([
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Deleted specific category' }),
    (0, common_1.Delete)('/delete/:categoryId'),
    __param(0, (0, common_1.Param)('categoryId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CategoriesController.prototype, "deleteCategoryById", null);
__decorate([
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Fetched all Category' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'category not found' }),
    (0, common_1.Put)('/update/:categoryId'),
    __param(0, (0, common_1.Param)('categoryId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, category_create_dto_1.CreateCategoryDto]),
    __metadata("design:returntype", Promise)
], CategoriesController.prototype, "updateCategory", null);
CategoriesController = __decorate([
    (0, swagger_1.ApiTags)('categories'),
    (0, common_1.Controller)('category'),
    __metadata("design:paramtypes", [categories_service_1.CategoriesService])
], CategoriesController);
exports.CategoriesController = CategoriesController;
//# sourceMappingURL=categories.controller.js.map
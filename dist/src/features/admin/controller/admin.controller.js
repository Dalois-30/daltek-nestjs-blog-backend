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
exports.AdminController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const create_user_dto_1 = require("../../../auth/dto/create-user.dto");
const admin_user_service_1 = require("../service/admin-user.service");
const passport_1 = require("@nestjs/passport");
const create_role_dto_1 = require("../dto/create-role.dto");
const admin_role_service_1 = require("../service/admin-role.service");
let AdminController = class AdminController {
    constructor(adminService, adminRoleService) {
        this.adminService = adminService;
        this.adminRoleService = adminRoleService;
    }
    async createAdmin(user, res) {
        const response = await this.adminService.createAdmin(user, res);
        return Object.assign({}, response);
    }
    async getAllUsers(headers) {
        console.log(headers);
        return await this.adminService.findAllUser(headers);
    }
    async getUsersByRoleId(roleId) {
        const response = await this.adminService.userByRoleId(roleId);
        return Object.assign({}, response);
    }
    async deleteUserById(id) {
        return await this.adminService.deleteUserById(id);
    }
    async createRole(role, res) {
        const response = await this.adminRoleService.createRole(role, res);
        return Object.assign({}, response);
    }
    async updateRole(roleId, role) {
        const response = await this.adminRoleService.updateRole(roleId, role);
        return Object.assign({}, response);
    }
    async updateRolesForUser(userId, roleIds) {
        return await this.adminService.updateUserRole(userId, roleIds);
    }
};
exports.AdminController = AdminController;
__decorate([
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Successfully created admin' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    (0, common_1.Post)('/user/create'),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_dto_1.CreateUserDto, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "createAdmin", null);
__decorate([
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Fetched all users' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized access' }),
    (0, common_1.Get)('/users/list'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Headers)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getAllUsers", null);
__decorate([
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Successfully created role' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    (0, common_1.Post)('/user/by-role/:roleId'),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Param)('roleId', new common_1.ParseUUIDPipe({ version: '4' }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getUsersByRoleId", null);
__decorate([
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Deleted specific user' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized access' }),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Delete)('/user/delete/:userId'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('userId', new common_1.ParseUUIDPipe({ version: '4' }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "deleteUserById", null);
__decorate([
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Successfully created role' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    (0, common_1.Post)('/role/create'),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_role_dto_1.CreateRoleDto, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "createRole", null);
__decorate([
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Successfully update role' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    (0, common_1.Put)('/role/update/:roleId'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('roleId', new common_1.ParseUUIDPipe({ version: '4' }))),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_role_dto_1.CreateRoleDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateRole", null);
__decorate([
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Update role' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized access' }),
    (0, common_1.Put)('/role/:userId/update-roles'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('userId', new common_1.ParseUUIDPipe({ version: '4' }))),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Array]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateRolesForUser", null);
exports.AdminController = AdminController = __decorate([
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiTags)('admin'),
    (0, common_1.Controller)('admin'),
    __metadata("design:paramtypes", [admin_user_service_1.AdminUserService,
        admin_role_service_1.AdminRoleService])
], AdminController);
//# sourceMappingURL=admin.controller.js.map
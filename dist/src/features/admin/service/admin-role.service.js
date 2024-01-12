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
exports.AdminRoleService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const api_response_1 = require("../../../shared/response/api-response");
const typeorm_2 = require("typeorm");
const role_entity_1 = require("../../role/entities/role.entity");
let AdminRoleService = class AdminRoleService {
    constructor(roleRepository) {
        this.roleRepository = roleRepository;
    }
    async createRole(createRoleDto, response) {
        const res = new api_response_1.ApiResponseDTO();
        try {
            const role = await this.roleRepository.findOneBy({ roleName: createRoleDto.roleName });
            if (role) {
                throw new common_1.HttpException('role already exists', common_1.HttpStatus.CONFLICT);
            }
            const newRole = new role_entity_1.Role();
            newRole.roleName = createRoleDto.roleName;
            newRole.description = createRoleDto.description;
            const roleResponse = await this.roleRepository.save(newRole);
            res.data = roleResponse;
            res.statusCode = common_1.HttpStatus.CREATED;
            res.message = "role created successfully";
        }
        catch (error) {
            res.statusCode = common_1.HttpStatus.BAD_REQUEST;
            res.message = error.message;
        }
        return response.send(res);
    }
    async updateRole(roleId, roleUpdateDto) {
        const res = new api_response_1.ApiResponseDTO();
        try {
            const roleToUpdate = await this.roleRepository.findOneBy({
                id: roleId
            });
            if (!roleToUpdate) {
                throw new common_1.HttpException('Role not found', common_1.HttpStatus.NOT_FOUND);
            }
            roleToUpdate.roleName = roleUpdateDto.roleName;
            roleToUpdate.description = roleUpdateDto.description;
            const updatedRole = await this.roleRepository.save(roleToUpdate);
            res.data = updatedRole;
            res.statusCode = common_1.HttpStatus.CREATED;
            res.message = "role updated successfully";
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.BAD_REQUEST);
        }
        return res;
    }
};
exports.AdminRoleService = AdminRoleService;
exports.AdminRoleService = AdminRoleService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(role_entity_1.Role)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], AdminRoleService);
//# sourceMappingURL=admin-role.service.js.map
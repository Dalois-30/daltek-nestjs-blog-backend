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
exports.AdminUserService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("../../../auth/entities/user.entity");
const api_response_1 = require("../../../shared/response/api-response");
const typeorm_2 = require("typeorm");
const shared_service_1 = require("../../../shared/services/shared.service");
const users_service_1 = require("../../users/services/users.service");
const role_entity_1 = require("../../role/entities/role.entity");
const user_roles_1 = require("../../../auth/enums/user-roles");
const console_1 = require("console");
let AdminUserService = class AdminUserService {
    constructor(usersService, userRepository, roleRepository, sharedService) {
        this.usersService = usersService;
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.sharedService = sharedService;
    }
    async createAdmin(createUserDto, response) {
        const res = new api_response_1.ApiResponseDTO();
        try {
            const user = await this.usersService.findOneByEmail(createUserDto.email);
            if (user) {
                throw new common_1.HttpException('User already exists', common_1.HttpStatus.CONFLICT);
            }
            const userName = await this.userRepository.findOneBy({ username: createUserDto.username });
            if (userName) {
                throw new common_1.HttpException('username already exists', common_1.HttpStatus.CONFLICT);
            }
            const newUser = new user_entity_1.User();
            newUser.email = createUserDto.email;
            newUser.password = createUserDto.password;
            newUser.username = createUserDto.username;
            const adminRole = await this.roleRepository.findOne({
                where: {
                    roleName: user_roles_1.UserRolesEnum.ADMIN
                }
            });
            if (adminRole) {
                newUser.userRoles = [adminRole];
            }
            const userResponse = await this.userRepository.save(newUser);
            await this.sharedService.createEmailToken(newUser.email, response);
            res.data = userResponse;
            res.statusCode = common_1.HttpStatus.CREATED;
            res.message = "user created successfully";
        }
        catch (error) {
            res.statusCode = common_1.HttpStatus.BAD_REQUEST;
            res.message = error.message;
        }
        return response.send(res);
    }
    async findAllUser(headers) {
        const res = new api_response_1.ApiResponseDTO();
        try {
            const result = await this.userRepository.find();
            res.data = result;
            res.message = "Successfully get users information";
            res.statusCode = common_1.HttpStatus.OK;
        }
        catch (error) {
            res.statusCode = common_1.HttpStatus.BAD_REQUEST;
            res.message = error.message;
        }
        return res;
    }
    async deleteUserById(id) {
        const res = new api_response_1.ApiResponseDTO();
        try {
            const user = await this.userRepository.findOneBy({ id: id });
            if (user === undefined || user === null) {
                throw new common_1.HttpException("User doesn't exists", common_1.HttpStatus.BAD_REQUEST);
            }
            await this.userRepository.delete(id);
            res.statusCode = common_1.HttpStatus.OK;
            res.message = "User deleted successfully";
        }
        catch (error) {
            res.statusCode = common_1.HttpStatus.BAD_REQUEST;
            res.message = error.message;
        }
        return res;
    }
    async userByRoleId(roleId) {
        const res = new api_response_1.ApiResponseDTO();
        try {
            const users = await this.userRepository
                .createQueryBuilder('user')
                .innerJoin('user.userRoles', 'userRole')
                .where('userRole.id = :roleId', { roleId })
                .getMany();
            if (!users || users.length === 0) {
                throw new common_1.HttpException('No users found for the specified role', common_1.HttpStatus.NOT_FOUND);
            }
            res.data = users;
            res.statusCode = common_1.HttpStatus.OK;
            res.message = 'Users retrieved successfully';
        }
        catch (error) {
            res.statusCode = common_1.HttpStatus.BAD_REQUEST;
            res.message = error.message;
        }
        return res;
    }
    async updateUserRole(userId, roleIds) {
        const res = new api_response_1.ApiResponseDTO();
        try {
            const roles = await this.roleRepository.find({ where: { id: (0, typeorm_2.In)(roleIds) } });
            const result = await this.usersService.findOneById(userId);
            const user = result.data;
            (0, console_1.log)(roles);
            user.userRoles = roles;
            await this.userRepository.save(user);
            res.statusCode = common_1.HttpStatus.OK;
            res.message = 'Roles updated successfully';
        }
        catch (error) {
            res.statusCode = common_1.HttpStatus.BAD_REQUEST;
            res.message = error.message;
        }
        return res;
    }
    async deleteAll() {
        return await this.userRepository.clear();
    }
};
exports.AdminUserService = AdminUserService;
exports.AdminUserService = AdminUserService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(2, (0, typeorm_1.InjectRepository)(role_entity_1.Role)),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        typeorm_2.Repository,
        typeorm_2.Repository,
        shared_service_1.SharedService])
], AdminUserService);
//# sourceMappingURL=admin-user.service.js.map
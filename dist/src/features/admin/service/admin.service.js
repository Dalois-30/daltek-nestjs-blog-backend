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
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const user_roles_1 = require("../../../auth/constant/user-roles");
const user_entity_1 = require("../../../auth/entities/user.entity");
const api_response_1 = require("../../../shared/response/api-response");
const typeorm_2 = require("typeorm");
const shared_service_1 = require("../../../shared/services/shared.service");
const users_service_1 = require("../../users/services/users.service");
let AdminService = class AdminService {
    constructor(usersService, userRepository, sharedService) {
        this.usersService = usersService;
        this.userRepository = userRepository;
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
            newUser.role = user_roles_1.UserRoles.ADMIN;
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
};
AdminService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        typeorm_2.Repository,
        shared_service_1.SharedService])
], AdminService);
exports.AdminService = AdminService;
//# sourceMappingURL=admin.service.js.map
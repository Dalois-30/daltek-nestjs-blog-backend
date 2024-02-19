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
var DatabaseModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseModule = void 0;
const common_1 = require("@nestjs/common");
const env_module_1 = require("../env/env.module");
const dbconfig_1 = require("./constant/dbconfig");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("../../auth/entities/user.entity");
const category_model_1 = require("../../features/categories/models/category.model");
const comments_model_1 = require("../../features/comments/models/comments.model");
const posts_model_1 = require("../../features/posts/models/posts.model");
const userRole_entity_1 = require("../../auth/entities/userRole.entity");
const role_entity_1 = require("../../features/role/entities/role.entity");
const typeorm_2 = require("typeorm");
const user_roles_1 = require("../../auth/enums/user-roles");
let DatabaseModule = DatabaseModule_1 = class DatabaseModule {
    constructor(userRepository, roleRepository) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.logger = new common_1.Logger(DatabaseModule_1.name);
    }
    async onModuleInit() {
        const roles = ["Admin", "Blogger"];
        roles.forEach(async (roleName) => {
            const newRole = await this.roleRepository.findOneBy({ roleName: roleName });
            if (!newRole) {
                const savedRole = new role_entity_1.Role();
                savedRole.roleName = roleName;
                savedRole.description = roleName;
                const roleResponse = await this.roleRepository.save(savedRole);
                this.logger.verbose("Roles created");
            }
        });
        const user = await this.userRepository.findOneBy({ username: "admin" });
        if (!user) {
            const newUser = new user_entity_1.User();
            newUser.email = "admin@admin.com";
            newUser.password = "Admin1234";
            newUser.username = "admin";
            const adminRole = await this.roleRepository.findOne({
                where: {
                    roleName: user_roles_1.UserRolesEnum.ADMIN
                }
            });
            if (adminRole) {
                newUser.userRoles = [adminRole];
            }
            const userResponse = await this.userRepository.save(newUser);
            this.logger.verbose("Database module initialized");
        }
    }
};
exports.DatabaseModule = DatabaseModule;
exports.DatabaseModule = DatabaseModule = DatabaseModule_1 = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [
            env_module_1.EnvModule,
            (0, dbconfig_1.DatabaseOrmModule)(),
            typeorm_1.TypeOrmModule.forFeature([user_entity_1.User]),
            typeorm_1.TypeOrmModule.forFeature([category_model_1.Category]),
            typeorm_1.TypeOrmModule.forFeature([posts_model_1.Posts]),
            typeorm_1.TypeOrmModule.forFeature([comments_model_1.Comments]),
            typeorm_1.TypeOrmModule.forFeature([userRole_entity_1.UserRole]),
            typeorm_1.TypeOrmModule.forFeature([role_entity_1.Role]),
        ],
        exports: [
            typeorm_1.TypeOrmModule.forFeature([user_entity_1.User]),
            typeorm_1.TypeOrmModule.forFeature([category_model_1.Category]),
            typeorm_1.TypeOrmModule.forFeature([posts_model_1.Posts]),
            typeorm_1.TypeOrmModule.forFeature([comments_model_1.Comments]),
            typeorm_1.TypeOrmModule.forFeature([userRole_entity_1.UserRole]),
            typeorm_1.TypeOrmModule.forFeature([role_entity_1.Role]),
        ]
    }),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(role_entity_1.Role)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], DatabaseModule);
//# sourceMappingURL=database.module.js.map
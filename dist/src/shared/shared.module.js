"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SharedModule = void 0;
const common_1 = require("@nestjs/common");
const database_module_1 = require("./database/database.module");
const env_module_1 = require("./env/env.module");
const axios_1 = require("@nestjs/axios");
const jwt_1 = require("@nestjs/jwt");
const passport_1 = require("@nestjs/passport");
const typeorm_1 = require("@nestjs/typeorm");
const constants_1 = require("../auth/constant/constants");
const user_entity_1 = require("../auth/entities/user.entity");
const upload_module_1 = require("./upload/upload.module");
const category_model_1 = require("../features/categories/models/category.model");
const posts_model_1 = require("../features/posts/models/posts.model");
const shared_service_1 = require("./shared.service");
const comments_model_1 = require("../features/comments/models/comments.model");
let SharedModule = class SharedModule {
};
SharedModule = __decorate([
    (0, common_1.Module)({
        imports: [
            database_module_1.DatabaseModule,
            env_module_1.EnvModule,
            typeorm_1.TypeOrmModule.forFeature([user_entity_1.User]),
            typeorm_1.TypeOrmModule.forFeature([category_model_1.Category]),
            typeorm_1.TypeOrmModule.forFeature([posts_model_1.Posts]),
            typeorm_1.TypeOrmModule.forFeature([comments_model_1.Comments]),
            axios_1.HttpModule,
            passport_1.PassportModule.register({ defaultStrategy: 'jwt', session: false }),
            jwt_1.JwtModule.register({
                secret: process.env.SECRET_KEY,
                signOptions: {
                    expiresIn: constants_1.EXPIRES_IN,
                },
            }),
            upload_module_1.UploadModule,
        ],
        exports: [
            database_module_1.DatabaseModule,
            env_module_1.EnvModule,
            typeorm_1.TypeOrmModule.forFeature([user_entity_1.User]),
            typeorm_1.TypeOrmModule.forFeature([category_model_1.Category]),
            typeorm_1.TypeOrmModule.forFeature([posts_model_1.Posts]),
            typeorm_1.TypeOrmModule.forFeature([comments_model_1.Comments]),
            axios_1.HttpModule,
            passport_1.PassportModule.register({ defaultStrategy: 'jwt', session: false }),
            jwt_1.JwtModule.register({
                secret: process.env.SECRET_KEY,
                signOptions: {
                    expiresIn: constants_1.EXPIRES_IN,
                },
            }),
            upload_module_1.UploadModule
        ],
        providers: [shared_service_1.SharedService]
    })
], SharedModule);
exports.SharedModule = SharedModule;
//# sourceMappingURL=shared.module.js.map
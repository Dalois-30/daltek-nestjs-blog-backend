"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const auth_controller_1 = require("./auth.controller");
const auth_service_1 = require("./auth.service");
const jwt_strategy_1 = require("./strategies/jwt.strategy");
const jwt_1 = require("@nestjs/jwt");
const passport_1 = require("@nestjs/passport");
require("dotenv/config");
const typeorm_1 = require("@nestjs/typeorm");
const emailverification_entity_1 = require("./entities/emailverification.entity");
const users_module_1 = require("../features/users/users.module");
const constants_1 = require("./constant/constants");
const user_entity_1 = require("./entities/user.entity");
const jwt_payload_service_1 = require("./jwt.payload.service");
let AuthModule = class AuthModule {
};
AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            passport_1.PassportModule.register({ defaultStrategy: 'jwt', session: true }),
            jwt_1.JwtModule.register({
                secret: process.env.SECRET_KEY,
                signOptions: {
                    expiresIn: constants_1.EXPIRES_IN,
                },
            }),
            typeorm_1.TypeOrmModule.forFeature([emailverification_entity_1.EmailVerificationEntity, user_entity_1.User]),
            users_module_1.UsersModule,
        ],
        controllers: [auth_controller_1.AuthController],
        providers: [auth_service_1.AuthService, jwt_strategy_1.JwtStrategy, jwt_payload_service_1.JwtPayloadService],
    })
], AuthModule);
exports.AuthModule = AuthModule;
//# sourceMappingURL=auth.module.js.map
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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const swagger_1 = require("@nestjs/swagger");
const create_user_dto_1 = require("./dto/create-user.dto");
const login_user_dto_1 = require("./dto/login-user.dto");
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    async createUser(user, res) {
        const response = await this.authService.create(user, res);
        return Object.assign({}, response);
    }
    async createAdmin(user, res) {
        const response = await this.authService.createAdmin(user, res);
        return Object.assign({}, response);
    }
    async login(loginUserDto) {
        return await this.authService.validateUserByPassword(loginUserDto);
    }
    async sendEmailVerification(email, res) {
        const result = await this.authService.createEmailToken(email, res);
        res.send(result);
    }
    async resetPassword(email, resetPassDto) {
        return await this.authService.resetPassword(email, resetPassDto);
    }
    async verifyEmail(token, email, req) {
        const verified = await this.authService.verifyEmail(token, email, req);
        if (verified) {
            return { message: 'Verified email' };
        }
    }
};
__decorate([
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Successfully created user' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    (0, common_1.Post)('/register'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_dto_1.CreateUserDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "createUser", null);
__decorate([
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Successfully created admin' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    (0, common_1.Post)('/admin/create'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_dto_1.CreateUserDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "createAdmin", null);
__decorate([
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Successfully logged in' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Wrong credentials' }),
    (0, common_1.Post)('/login'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_user_dto_1.LoginUserDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Successfully send verification code',
    }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'User not found' }),
    (0, common_1.Post)('/resend-verification/'),
    __param(0, (0, common_1.Query)('email')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "sendEmailVerification", null);
__decorate([
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Successfully change password',
    }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'User not found' }),
    (0, common_1.Post)('/reset-password'),
    __param(0, (0, common_1.Query)('email')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_user_dto_1.ResetPassWordDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "resetPassword", null);
__decorate([
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Successfully verified email' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Invalid token' }),
    (0, common_1.Post)('email/verify'),
    __param(0, (0, common_1.Query)('token')),
    __param(1, (0, common_1.Query)('email')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verifyEmail", null);
AuthController = __decorate([
    (0, swagger_1.ApiTags)('auth'),
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map
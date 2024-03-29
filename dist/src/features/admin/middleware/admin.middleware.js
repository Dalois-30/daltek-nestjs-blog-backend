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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminMiddleware = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const console_1 = require("console");
let AdminMiddleware = class AdminMiddleware {
    constructor(jwtService) {
        this.jwtService = jwtService;
    }
    async use(req, res, next) {
        try {
            await this.checkIfAdmin(req.headers);
            next();
        }
        catch (error) {
            next(error);
        }
    }
    async checkIfAdmin(headers) {
        try {
            let token = headers["authorization"].split(' ');
            const decodedJwtAccessToken = await this.jwtService.verify(token[1]);
            (0, console_1.log)(headers);
            if (!decodedJwtAccessToken.roles || !decodedJwtAccessToken.roles.includes("Admin")) {
                throw new common_1.HttpException('You are not an admin', common_1.HttpStatus.UNAUTHORIZED);
            }
        }
        catch (error) {
            throw new common_1.HttpException('Invalid token or unauthorized', common_1.HttpStatus.UNAUTHORIZED);
        }
    }
};
exports.AdminMiddleware = AdminMiddleware;
exports.AdminMiddleware = AdminMiddleware = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService])
], AdminMiddleware);
//# sourceMappingURL=admin.middleware.js.map
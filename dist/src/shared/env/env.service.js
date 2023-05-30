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
exports.EnvService = void 0;
const dotenv = require("dotenv");
const fs = require("fs");
const common_1 = require("@nestjs/common");
let EnvService = class EnvService {
    constructor() {
        const environment = process.env.NODE_ENV || 'development';
        const data = dotenv.parse(fs.readFileSync(`.env`));
        data.APP_ENV = environment;
        data.APP_DEBUG = data.APP_DEBUG === 'true' ? true : false;
        data.DB_PORT = parseInt(data.DB_PORT);
        this.vars = data;
    }
    read() {
        return this.vars;
    }
    isDev() {
        return this.vars.APP_ENV === 'development';
    }
    isProd() {
        return this.vars.APP_ENV === 'production';
    }
};
EnvService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], EnvService);
exports.EnvService = EnvService;
//# sourceMappingURL=env.service.js.map
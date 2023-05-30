"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseModule = void 0;
const common_1 = require("@nestjs/common");
const path_1 = require("path");
const env_service_1 = require("../env/env.service");
const typeorm_1 = require("@nestjs/typeorm");
const env_module_1 = require("../env/env.module");
function DatabaseOrmModule() {
    const config = new env_service_1.EnvService().read();
    return typeorm_1.TypeOrmModule.forRoot({
        type: config.DB_TYPE,
        host: config.DB_HOST,
        port: config.DB_PORT,
        username: config.DB_USER,
        password: config.DB_PASSWORD,
        database: config.DB_NAME,
        entities: [(0, path_1.join)(__dirname, '/../**/**.entity{.ts,.js}')],
        autoLoadEntities: true,
        synchronize: true,
    });
}
let DatabaseModule = class DatabaseModule {
};
DatabaseModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [
            env_module_1.EnvModule,
            DatabaseOrmModule(),
        ],
    })
], DatabaseModule);
exports.DatabaseModule = DatabaseModule;
//# sourceMappingURL=database.module.js.map
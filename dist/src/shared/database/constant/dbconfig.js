"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseOrmModule = void 0;
const typeorm_1 = require("@nestjs/typeorm");
const path_1 = require("path");
const env_service_1 = require("../../env/env.service");
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
exports.DatabaseOrmModule = DatabaseOrmModule;
//# sourceMappingURL=dbconfig.js.map
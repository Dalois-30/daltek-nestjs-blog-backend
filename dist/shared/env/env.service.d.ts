export interface EnvData {
    [x: string]: any;
    APP_ENV: string;
    APP_DEBUG: boolean;
    DB_TYPE: 'mysql' | 'mariadb';
    DB_HOST?: string;
    DB_NAME: string;
    DB_PORT?: number;
    DB_USER: string;
    DB_PASSWORD: string;
}
export declare class EnvService {
    private vars;
    constructor();
    read(): EnvData;
    isDev(): boolean;
    isProd(): boolean;
}

/// <reference types="node" />
import { ConfigService } from '@nestjs/config';
export declare class UploadService {
    private readonly configService;
    private readonly s3Client;
    constructor(configService: ConfigService);
    upload(fileName: string, file: Buffer): Promise<string>;
}

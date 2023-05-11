/// <reference types="node" />
import { ConfigService } from '@nestjs/config';
import { GetFileDto } from './get-file-dto';
export declare class UploadService {
    private readonly configService;
    private readonly s3Client;
    constructor(configService: ConfigService);
    upload(fileName: string, file: Buffer): Promise<string>;
    getUploadedObject(key: GetFileDto): Promise<string>;
}

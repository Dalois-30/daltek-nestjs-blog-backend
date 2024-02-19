/// <reference types="node" />
import { ConfigService } from '@nestjs/config';
import { GetFileDto } from './get-file-dto';
import { HttpService } from '@nestjs/axios';
export declare class UploadService {
    private readonly configService;
    private httpService;
    private readonly s3Client;
    constructor(configService: ConfigService, httpService: HttpService);
    upload(fileName: string, file: Buffer): Promise<string>;
    compressImage(imageBuffer: Buffer): Promise<Buffer>;
    private downloadImage;
    getUploadedObject(key: GetFileDto): Promise<string>;
    getSignedImageUrls(prefix?: string): Promise<string[]>;
}

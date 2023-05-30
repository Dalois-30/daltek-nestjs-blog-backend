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
exports.UploadService = void 0;
const common_1 = require("@nestjs/common");
const client_s3_1 = require("@aws-sdk/client-s3");
const config_1 = require("@nestjs/config");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
let UploadService = class UploadService {
    constructor(configService) {
        this.configService = configService;
        this.s3Client = new client_s3_1.S3Client({
            region: this.configService.getOrThrow('AWS_S3_REGION'),
        });
    }
    async upload(fileName, file) {
        const result = await this.s3Client.send(new client_s3_1.PutObjectCommand({
            Bucket: this.configService.getOrThrow('AWS_BUCKET_NAME'),
            Key: `users/${fileName}`,
            Body: file,
        }));
        const uploadedObjectUrl = `https://${this.configService.getOrThrow('AWS_BUCKET_NAME')}.s3.amazonaws.com/users/${fileName}`;
        console.log(uploadedObjectUrl);
        return `users/${fileName}`;
    }
    async getUploadedObject(key) {
        try {
            const command = new client_s3_1.GetObjectCommand({
                Bucket: this.configService.getOrThrow('AWS_BUCKET_NAME'),
                Key: key.key
            });
            const url = await (0, s3_request_presigner_1.getSignedUrl)(this.s3Client, command, {
                expiresIn: 15 * 60
            });
            return url;
        }
        catch (err) {
            console.log(err);
            throw new Error('Impossible de récupérer l\'image.');
        }
    }
    async getSignedImageUrls(prefix) {
        try {
            let command = new client_s3_1.ListObjectsCommand({ Bucket: this.configService.getOrThrow('AWS_BUCKET_NAME') });
            if (prefix) {
                command = new client_s3_1.ListObjectsCommand({ Bucket: this.configService.getOrThrow('AWS_BUCKET_NAME'), Prefix: prefix });
            }
            const listObjectsCommand = command;
            const listObjectsResult = await this.s3Client.send(listObjectsCommand);
            const contents = listObjectsResult.Contents || [];
            const presignedUrls = await Promise.all(contents.map(async (object) => {
                const urlParams = {
                    Bucket: this.configService.getOrThrow('AWS_BUCKET_NAME'),
                    Key: object.Key
                };
                const getCommand = new client_s3_1.GetObjectCommand(urlParams);
                const presignedUrl = await (0, s3_request_presigner_1.getSignedUrl)(this.s3Client, getCommand, { expiresIn: 3600 });
                return presignedUrl;
            }));
            console.log(presignedUrls);
            return presignedUrls;
        }
        catch (err) {
            console.log('Error', err);
            return [];
        }
    }
};
UploadService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], UploadService);
exports.UploadService = UploadService;
//# sourceMappingURL=upload.service.js.map
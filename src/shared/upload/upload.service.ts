import { Injectable } from '@nestjs/common';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UploadService {
    private readonly s3Client = new S3Client({
        region: this.configService.getOrThrow('AWS_S3_REGION'),
    });
    constructor(private readonly configService: ConfigService) { }

    async upload(fileName: string, file: Buffer) {
        const result = await this.s3Client.send(
            new PutObjectCommand({
                Bucket: this.configService.getOrThrow('AWS_BUCKET_NAME'),
                Key: `users/${fileName}`,
                Body: file,
            })
        )
        // console.log(result);
        const uploadedObjectUrl = `https://${this.configService.getOrThrow('AWS_BUCKET_NAME')}.s3.amazonaws.com/users/${fileName}`;
        console.log(uploadedObjectUrl);
        
        return uploadedObjectUrl;

    }
}


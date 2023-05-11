import { Injectable } from '@nestjs/common';
import { GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { GetFileDto } from './get-file-dto'; 
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

@Injectable()
export class UploadService {
    private readonly s3Client = new S3Client({
        region: this.configService.getOrThrow('AWS_S3_REGION'),
    });
    constructor(private readonly configService: ConfigService) { }

    /**
     * 
     * @param fileName the name of the file
     * @param file the binary file
     * @returns the key of the file newly uploaded
     */
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

    /**
     * 
     * @param key the key of the file to retrieve
     * @returns the link access to the file, valid only for 15min
     */
    async getUploadedObject(key: GetFileDto) {
        try {
            const command = new GetObjectCommand({
                Bucket: this.configService.getOrThrow('AWS_BUCKET_NAME'),
                Key: key.key
            })
            
            const url = await getSignedUrl(this.s3Client, command, {
                expiresIn: 15 * 60
            })
            return url;
          } catch (err) {
            console.log(err);
            throw new Error('Impossible de récupérer l\'image.');
          }
    }
}


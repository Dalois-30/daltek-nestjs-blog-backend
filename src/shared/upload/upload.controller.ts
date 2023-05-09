import { Controller, FileTypeValidator, MaxFileSizeValidator, ParseFilePipe, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { ApiConsumes, ApiBody, ApiResponse } from '@nestjs/swagger';

@Controller('upload')
export class UploadController {

    constructor(private readonly uploadService: UploadService){}

    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    })
    @ApiResponse({ status: 200, description: 'Upload image' })
    @Post()
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(@UploadedFile(
        new ParseFilePipe({
            validators: [
                // new MaxFileSizeValidator({ maxSize: 6000 }),
                // new FileTypeValidator({ fileType: 'image/jpeg' })
            ]
        })
    ) file: Express.Multer.File){
        return await this.uploadService.upload(file.originalname, file.buffer)
    }
}

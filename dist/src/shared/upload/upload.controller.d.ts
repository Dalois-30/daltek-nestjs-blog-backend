/// <reference types="multer" />
import { UploadService } from './upload.service';
import { GetFileDto, GetFileListDto } from './get-file-dto';
export declare class UploadController {
    private readonly uploadService;
    constructor(uploadService: UploadService);
    uploadFile(file: Express.Multer.File): Promise<string>;
    getFile(getFile: GetFileDto): Promise<string>;
    getFileList(getFile?: GetFileListDto): Promise<string[]>;
}

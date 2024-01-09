import { Module } from '@nestjs/common';
import { CategoriesService } from './services/categories.service';
import { CategoriesController } from './controllers/categories.controller';
import { SharedModule } from 'src/shared/shared.module';
import { UploadModule } from 'src/shared/upload/upload.module';
import { UploadService } from 'src/shared/upload/upload.service';

@Module({
  imports: [
    SharedModule,
    UploadModule
  ],
  providers: [CategoriesService, UploadService],
  controllers: [CategoriesController]
})
export class CategoriesModule {}

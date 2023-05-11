import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { SharedModule } from 'src/shared/shared.module';
import { UploadModule } from 'src/shared/upload/upload.module';
import { UploadService } from 'src/shared/upload/upload.service';

@Module({
  imports: [
    SharedModule,
    UploadModule
  ],
  controllers: [PostsController],
  providers: [PostsService, UploadService]
})
export class PostsModule {}

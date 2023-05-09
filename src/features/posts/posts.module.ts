import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  imports: [
    SharedModule
  ],
  controllers: [PostsController],
  providers: [PostsService]
})
export class PostsModule {}

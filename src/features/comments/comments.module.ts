import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  imports: [
    SharedModule
  ],
  providers: [CommentsService],
  controllers: [CommentsController]
})
export class CommentsModule {}

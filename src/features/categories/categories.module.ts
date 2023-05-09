import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  imports: [
    SharedModule
  ],
  providers: [CategoriesService],
  controllers: [CategoriesController]
})
export class CategoriesModule {}

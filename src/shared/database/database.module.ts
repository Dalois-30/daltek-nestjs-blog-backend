import { Module, Global } from '@nestjs/common';
import { EnvModule } from '../env/env.module';
import { DatabaseOrmModule } from './constant/dbconfig';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';
import { Category } from 'src/features/categories/models/category.model';
import { Comments } from 'src/features/comments/models/comments.model';
import { Posts } from 'src/features/posts/models/posts.model';



@Global()
@Module({
  imports: [
    EnvModule,
    DatabaseOrmModule(),
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([Category]),
    TypeOrmModule.forFeature([Posts]),
    TypeOrmModule.forFeature([Comments]),
  ],
  exports: [
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([Category]),
    TypeOrmModule.forFeature([Posts]),
    TypeOrmModule.forFeature([Comments]),]
})
export class DatabaseModule { }

import { Module, Global } from '@nestjs/common';
import { EnvModule } from '../env/env.module';
import { DatabaseOrmModule } from './constant/dbconfig';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';
import { Category } from 'src/features/categories/models/category.model';
import { Comments } from 'src/features/comments/models/comments.model';
import { Posts } from 'src/features/posts/models/posts.model';
import { UserRole } from 'src/auth/entities/userRole.entity';
import { Role } from 'src/features/role/entities/role.entity';



@Global()
@Module({
  imports: [
    EnvModule,
    DatabaseOrmModule(),
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([Category]),
    TypeOrmModule.forFeature([Posts]),
    TypeOrmModule.forFeature([Comments]),
    TypeOrmModule.forFeature([UserRole]),
    TypeOrmModule.forFeature([Role]),
  ],
  exports: [
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([Category]),
    TypeOrmModule.forFeature([Posts]),
    TypeOrmModule.forFeature([Comments]),
    TypeOrmModule.forFeature([UserRole]),
    TypeOrmModule.forFeature([Role]),
  ]
})
export class DatabaseModule { }

import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { EnvModule } from './env/env.module';
import { HttpModule } from '@nestjs/axios';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EXPIRES_IN } from 'src/auth/constant/constants';
import { User } from 'src/auth/entities/user.entity';
import { UploadModule } from './upload/upload.module';
import { Category } from 'src/features/categories/models/category.model';
import { Posts } from 'src/features/posts/models/posts.model';
import { SharedService } from './shared.service';

@Module({
  imports: [
    DatabaseModule, 
    EnvModule,
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([Category]),
    TypeOrmModule.forFeature([Posts]),
    HttpModule,
    PassportModule.register({ defaultStrategy: 'jwt', session: false }),
    JwtModule.register({
        secret: process.env.SECRET_KEY,
        signOptions: {
            expiresIn: EXPIRES_IN,
        },
    }),
    UploadModule,
  ],
  exports: [
    DatabaseModule, 
    EnvModule,
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([Category]),
    TypeOrmModule.forFeature([Posts]),
    HttpModule,
    PassportModule.register({ defaultStrategy: 'jwt', session: false }),
    JwtModule.register({
        secret: process.env.SECRET_KEY,
        signOptions: {
            expiresIn: EXPIRES_IN,
        },
    }),
    UploadModule
  ],
  providers: [SharedService]
})
export class SharedModule {}

import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { SharedModule } from 'src/shared/shared.module';
import { SharedService } from 'src/shared/shared.service';

@Module({
  imports: [
    SharedModule
  ],
  providers: [UsersService, SharedService],
  controllers: [UsersController],
  exports: [UsersService]
})
export class UsersModule {}

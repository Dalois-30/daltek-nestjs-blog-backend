import { Module } from '@nestjs/common';
import { AdminController } from './controller/admin.controller';
import { AdminService } from './service/admin.service';
import { SharedModule } from 'src/shared/shared.module';
import { UsersService } from '../users/services/users.service';
import { SharedService } from 'src/shared/services/shared.service';

@Module({
  imports: [
    SharedModule
  ],
  controllers: [AdminController],
  providers: [
    SharedService,
    AdminService,
    UsersService,
  ]
})
export class AdminModule {}

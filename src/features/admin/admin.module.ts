import { Module } from '@nestjs/common';
import { AdminController } from './controller/admin.controller';
import { AdminUserService } from './service/admin-user.service';
import { SharedModule } from 'src/shared/shared.module';
import { UsersService } from '../users/services/users.service';
import { SharedService } from 'src/shared/services/shared.service';
import { AdminRoleService } from './service/admin-role.service';

@Module({
  imports: [
    SharedModule
  ],
  controllers: [AdminController],
  providers: [
    SharedService,
    AdminUserService,
    UsersService,
    AdminRoleService
  ]
})
export class AdminModule {}

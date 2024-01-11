import { Body, Controller, Get, Post, Res, Headers, Delete, Param, UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { CreateUserDto } from 'src/auth/dto/create-user.dto';
import { AdminService } from '../service/admin.service';
import { Request as RequestExpress, Response } from 'express';
import { User } from 'src/auth/entities/user.entity';
import { ApiResponseDTO } from 'src/shared/response/api-response';
import { AuthGuard } from '@nestjs/passport';
import { CreateRoleDto } from '../dto/create-role.dto';

@ApiTags('admin')
@Controller('admin')
export class AdminController {

    constructor(
        private adminService: AdminService,
    ) { }

    @ApiResponse({ status: 201, description: 'Successfully created admin' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @Post('/user/create')
    async createAdmin(@Body() user: CreateUserDto, @Res() res: Response) {
        const response = await this.adminService.createAdmin(user, res);
        return {
            ...response,
        };
    }

    @ApiResponse({ status: 201, description: 'Successfully created role' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @Post('/role/create')
    async createRole(@Body() role: CreateRoleDto, @Res() res: Response) {
        const response = await this.adminService.createRole(role, res);
        return {
            ...response,
        };
    }

    @ApiResponse({ status: 201, description: 'Successfully created role' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @Post('/user/by-role/:roleId')
    async getUsersByRoleId(@Param('roleId', new ParseUUIDPipe({ version: '4' })) roleId: string) {
        const response = await this.adminService.userByRoleId(roleId);
        return {
            ...response,
        };
    }
    
    @ApiResponse({ status: 200, description: 'Fetched all users' })
    @ApiResponse({ status: 401, description: 'Unauthorized access' })
    // @UseGuards(AuthGuard('jwt'))
    @Get('/users/list')
    async getAllUsers(@Headers() headers): Promise<ApiResponseDTO<User[]>> {
      console.log(headers);
      
      return await this.adminService.findAll(headers);
    }


    @ApiResponse({ status: 200, description: 'Update user role' })
    @ApiResponse({ status: 401, description: 'Unauthorized access' })
    @Post('/user/:userId/update-roles')
    async updateRolesForUser(
      @Param('userId', new ParseUUIDPipe({ version: '4' })) userId: string,
      @Body() roleIds: string[],
    ){
      return await this.adminService.updateUserRole(userId, roleIds);
    }

      
    // @ApiResponse({ status: 200, description: 'Deleted all users' })
    // @ApiResponse({ status: 401, description: 'Unauthorized access' })
    // @UseGuards(AuthGuard('jwt'))
    // @Delete()
    // async deleteAllUsers() {
    //   return await this.adminService.deleteAll();
    // }
  
    @ApiResponse({ status: 200, description: 'Deleted specific user' })
    @ApiResponse({ status: 401, description: 'Unauthorized access' })
    @UseGuards(AuthGuard('jwt'))
    @Delete('/user/delete/:userId')
    async deleteUserById(@Param('userId', new ParseUUIDPipe({ version: '4' })) id: string) {
      return await this.adminService.deleteUserById(id);
    }
}

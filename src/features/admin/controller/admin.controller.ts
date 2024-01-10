import { Body, Controller, Get, Post, Res, Headers, Delete, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { CreateUserDto } from 'src/auth/dto/create-user.dto';
import { AdminService } from '../service/admin.service';
import { Request as RequestExpress, Response } from 'express';
import { User } from 'src/auth/entities/user.entity';
import { ApiResponseDTO } from 'src/shared/response/api-response';
import { AuthGuard } from '@nestjs/passport';

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
    
    @ApiResponse({ status: 200, description: 'Fetched all users' })
    @ApiResponse({ status: 401, description: 'Unauthorized access' })
    // @UseGuards(AuthGuard('jwt'))
    @Get('/users/list')
    async getAllUsers(@Headers() headers): Promise<ApiResponseDTO<User[]>> {
      console.log(headers);
      
      return await this.adminService.findAll(headers);
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
    @Delete('/user/delete/:id')
    async deleteUserById(@Param('id') id: string) {
      return await this.adminService.deleteUserById(id);
    }
}

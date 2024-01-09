import { Body, Controller, Post, Res } from '@nestjs/common';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { CreateUserDto } from 'src/auth/dto/create-user.dto';
import { AdminService } from '../service/admin.service';
import { Request as RequestExpress, Response } from 'express';

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
}

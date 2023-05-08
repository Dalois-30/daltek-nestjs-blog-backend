import {
    Controller,
    Post,
    Body,
    Get,
    Delete,
    Param,
    Headers,
    UseGuards,
    Put,
    Query,
  } from '@nestjs/common';
  import { UsersService } from './users.service';
  import { ApiTags, ApiResponse } from '@nestjs/swagger';
  import { AuthGuard } from '@nestjs/passport';
import { UpdateUserDto } from 'src/auth/dto/update-user.dto';
import { User } from 'src/auth/entities/user.entity';
  
  @ApiTags('users')
  @Controller('users')
  export class UsersController {
    constructor(private readonly usersService: UsersService) {}
  
    @ApiResponse({ status: 200, description: 'Fetched all users' })
    @ApiResponse({ status: 401, description: 'Unauthorized access' })
    @UseGuards(AuthGuard('jwt'))
    @Get()
    async getAllUsers(@Headers() headers): Promise<User[]> {
      console.log(headers);
      
      return await this.usersService.findAll(headers);
    }
  
    @ApiResponse({ status: 200, description: 'Fetched specific user' })
    @Get('email')
    async getUserByEmail(@Query('email') email: string): Promise<User> {
      return await this.usersService.findOneByEmail(email);
    }
  
    @ApiResponse({ status: 200, description: 'Fetched specific user' })
    @Get('/:id')
    async getUserById(@Param('id') id: string): Promise<User> {
      return await this.usersService.findOneById(id);
    }
  
    @ApiResponse({ status: 200, description: 'Deleted all users' })
    @ApiResponse({ status: 401, description: 'Unauthorized access' })
    @UseGuards(AuthGuard('jwt'))
    @Delete()
    async deleteAllUsers() {
      return await this.usersService.deleteAll();
    }
  
    @ApiResponse({ status: 200, description: 'Deleted specific user' })
    @ApiResponse({ status: 401, description: 'Unauthorized access' })
    @UseGuards(AuthGuard('jwt'))
    @Delete(':id')
    async deleteUserById(@Param('id') id: string) {
      return await this.usersService.deleteUserById(id);
    }
  
    @ApiResponse({ status: 200, description: 'Update specific user' })
    @ApiResponse({ status: 400, description: 'User not found' })
    @Put(':id')
    async updateUser(@Param('id') id: string, @Body() user: UpdateUserDto) {
      return await this.usersService.update(id, user);
    }
  
    @ApiResponse({ status: 200, description: 'Successfully authenticated user' })
    @ApiResponse({ status: 401, description: 'Unauthorized access' })
    @Get('authstate')
    @UseGuards(AuthGuard('jwt'))
    testAuthRoute() {
      return {message:'authenticated'};
    }
  }
  
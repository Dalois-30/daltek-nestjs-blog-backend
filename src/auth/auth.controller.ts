import { Controller, Post, Body, Param, Get, Query, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { CreateUserDto, ResetPassWordDto } from './dto/create-user.dto';
import { LoginUserDto, VerifyOtpDto } from './dto/login-user.dto';
import { Request as RequestExpress, Response } from 'express';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiResponse({ status: 201, description: 'Successfully created user' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @Post('/register')
  async createUser(@Body() user: CreateUserDto, @Res() res: Response) {
    const response = await this.authService.create(user, res);
    return {
      ...response,
    };
  }

  @ApiResponse({ status: 201, description: 'Successfully created admin' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @Post('/admin/create')
  async createAdmin(@Body() user: CreateUserDto, @Res() res: Response) {
    const response = await this.authService.createAdmin(user, res);
    return {
      ...response,
    };
  }

  @ApiResponse({ status: 200, description: 'Successfully logged in' })
  @ApiResponse({ status: 401, description: 'Wrong credentials' })
  @Post('/login')
  async login(@Body() loginUserDto: LoginUserDto) {
    return await this.authService.validateUserByPassword(loginUserDto);
  }

  @ApiResponse({
    status: 200,
    description: 'Successfully send verification code',
  })
  @ApiResponse({ status: 403, description: 'User not found' })
  @Post('/resend-verification/')
  async sendEmailVerification(@Query('email') email: string, @Res() res: Response) {
    const result = await this.authService.createEmailToken(email, res);
    res.send(result);
    // return await this.authService.sendEmailVerification(email);
  }

  @ApiResponse({
    status: 200,
    description: 'Successfully change password',
  })
  @ApiResponse({ status: 403, description: 'User not found' })
  @Post('/reset-password')
  async resetPassword(@Query('email') email: string, @Body() resetPassDto: ResetPassWordDto) {
    return await this.authService.resetPassword(email, resetPassDto);
  }

  @ApiResponse({ status: 200, description: 'Successfully verified email' })
  @ApiResponse({ status: 403, description: 'Invalid token' })
  @Post('email/verify')
  async verifyEmail(
    @Query('token') token: string, @Query('email') email: string, @Req() req: RequestExpress
  ) {
    const verified = await this.authService.verifyEmail(token, email, req);
    if (verified) {
      return {message: 'Verified email'};
    }
  }

}

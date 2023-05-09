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
  @Post('/email/register')
  async createUser(@Body() user: CreateUserDto) {
    const response = await this.authService.create(user);
    await this.authService.createEmailToken(user.email);
    const state = await this.authService.sendEmailVerification(user.email);
    return {
      ...response,
      ...state,
    };
  }

  @ApiResponse({ status: 201, description: 'Successfully created admin' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @Post('/admin/create')
  async createAdmin(@Body() user: CreateUserDto) {
    const response = await this.authService.createAdmin(user);
    await this.authService.createEmailToken(user.email);
    const state = await this.authService.sendEmailVerification(user.email);
    return {
      ...response,
      ...state,
    };
  }

  @ApiResponse({ status: 200, description: 'Successfully logged in' })
  @ApiResponse({ status: 401, description: 'Wrong credentials' })
  @Post('/email/login')
  async login(@Body() loginUserDto: LoginUserDto) {
    return await this.authService.validateUserByPassword(loginUserDto);
  }

  @ApiResponse({
    status: 200,
    description: 'Successfully send verification code',
  })
  @ApiResponse({ status: 403, description: 'User not found' })
  @Post('email/resend-verification/')
  async sendEmailVerification(@Query('email') email: string) {
    await this.authService.createEmailToken(email);
    return await this.authService.sendEmailVerification(email);
  }

  @ApiResponse({
    status: 200,
    description: 'Successfully change password',
  })
  @ApiResponse({ status: 403, description: 'User not found' })
  @Post('/reset-password/:id')
  async resetPassword(@Param('id') id: string, @Body() resetPassDto: ResetPassWordDto) {
    return await this.authService.resetPassword(id, resetPassDto);
  }

  @ApiResponse({ status: 200, description: 'Successfully verified email' })
  @ApiResponse({ status: 403, description: 'Invalid token' })
  @Post('email/verify/:token')
  async verifyEmail(
    @Param('token') token: string,
  ) {
    const verified = await this.authService.verifyEmail(token);
    if (verified) {
      return {message: 'Verified email'};
    }
  }

  @Post('create-otp')
  createOtp(@Res() res: Response) {
    return this.authService.createOtp(res);
  }

  @Post('verify-otp')
  verifyOtp(@Body() verifyOtpDto: VerifyOtpDto, @Req() req: RequestExpress) {
    console.log(verifyOtpDto);
    console.log(req.cookies);
    console.log(req.headers);
    return this.authService.verifyOtp(verifyOtpDto, req);
  }
}

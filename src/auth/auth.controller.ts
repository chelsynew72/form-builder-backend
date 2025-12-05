import { Controller, Post, Body, Get, UseGuards, Put, Request, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { GetUser } from '../common/decorators/get-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.signup(dto);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getCurrentUser(@GetUser() user) {
    return user;
  }


  @Put('profile')
  @UseGuards(JwtAuthGuard)
  async updateProfile(@Request() req: any, @Body() updateDto: any) {
    return this.authService.updateProfile(req.user.userId, updateDto);
  }

  @Put('password')
  @UseGuards(JwtAuthGuard)
  async changePassword(@Request() req, @Body() passwordDto: any) {
    return this.authService.changePassword(
      req.user.userId,
      passwordDto.currentPassword,
      passwordDto.newPassword,
    );
  }

  @Put('email-preferences')
  @UseGuards(JwtAuthGuard)
  async updateEmailPreferences(@Request() req, @Body() preferences: any) {
    return this.authService.updateEmailPreferences(req.user.userId, preferences);
  }

  @Delete('account')
  @UseGuards(JwtAuthGuard)
  async deleteAccount(@Request() req) {
    return this.authService.deleteAccount(req.user.userId);
  }
}


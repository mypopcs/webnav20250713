// /server/src/auth/auth.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
  Response,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LocalAuthGuard } from './local-auth.guard';
import { Response as ExpressResponse } from 'express';
import { JwtAuthGuard } from './jwt-auth.guard';
import { JwtRefreshGuard } from './jwt-refresh.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.register(registerUserDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @Request() req, // req.user 现在是 LocalStrategy 返回的纯净对象
    @Response({ passthrough: true }) res: ExpressResponse,
  ) {
    const tokens = await this.authService.login(req.user);

    res.cookie('access_token', tokens.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    });

    res.cookie('refresh_token', tokens.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    });

    return { statusCode: 200, message: '登录成功', user: req.user };
  }
  /**
   * 获取当前登录用户的个人信息
   * 这个接口受 JwtAuthGuard 保护，只有携带有效 access_token 的请求才能访问
   */
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    // req.user 是由 JwtStrategy 的 validate 方法返回的 payload 对象
    return req.user;
  }
  /**
   * 使用 refresh_token 获取新的 access_token
   */
  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  async refreshToken(
    @Request() req,
    @Response({ passthrough: true }) res: ExpressResponse,
  ) {
    const newTokens = await this.authService.refreshToken(req.user);
    // 重新设置新的 access_token
    res.cookie('access_token', newTokens.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    });
    return { statusCode: 200, message: '令牌刷新成功' };
  }
  /**
   * 退出登录
   */
  @Post('logout')
  logout(@Response({ passthrough: true }) res: ExpressResponse) {
    // 清除 cookie
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
    return { statusCode: 200, message: '退出成功' };
  }
}
// src/modules/auth/auth.controller.ts
import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginDto } from '../../common/dto/user.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { GetUser } from '../../common/decorators/get-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: CreateUserDto, @Res() res: Response) {
    const user = await this.authService.register(dto);

    const token = this.authService.signToken({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'lax', // 'none' solo con https en dominios distintos
      secure: false,   // true en producción con https
      path: '/',
      maxAge: 1000 * 60 * 60 * 24,
    });

    return res.send({ user });
  }

  @Post('login')
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const { access_token, user } = await this.authService.login(dto);

    res.cookie('token', access_token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      path: '/',
      maxAge: 1000 * 60 * 60 * 24,
    });

    return { access_token, user };
  }

  @Post('logout')
  async logout(@Res() res: Response) {
    res.clearCookie('token', { path: '/' });
    return res.send({ ok: true });
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async me(@GetUser() user: any) {
    const { password, ...userWithoutPassword } = user;
    return { user: userWithoutPassword };
  }
}

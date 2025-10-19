// src/modules/auth/auth.controller.ts
import { Body, Controller, Get, Post, Req, Res, UnauthorizedException } from '@nestjs/common';
import type { Response, Request } from 'express'; // 👈 IMPORT TYPE
import { AuthService } from './auth.service';
import { CreateUserDto, LoginDto } from '../../common/dto/user.dto';

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
  async me(@Req() req: Request, @Res() res: Response) {
    const token = req.cookies?.token;
    if (!token) throw new UnauthorizedException('No autenticado');

    const payload = this.authService.verifyToken(token);
    const user = await this.authService.validateUser(payload.sub);
    if (!user) throw new UnauthorizedException('No autenticado');

    const { password, ...userWithoutPassword } = user as any;
    return res.send({ user: userWithoutPassword });
  }
}

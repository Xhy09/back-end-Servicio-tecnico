// src/modules/auth/auth.controller.ts
import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginDto } from '../../common/dto/user.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { GetUser } from '../../common/decorators/get-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: CreateUserDto) {
    const user = await this.authService.register(dto);

    const token = this.authService.signToken({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    return { access_token: token, user };
  }

  @Post('login')
  async login(@Body() dto: LoginDto) {
    const { access_token, user } = await this.authService.login(dto);
    return { access_token, user };
  }

  @Post('logout')
  async logout() {
    return { message: 'Logged out successfully' };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async me(@GetUser() user: any) {
    const { password, ...userWithoutPassword } = user;
    return { user: userWithoutPassword };
  }
}

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { MailService } from '../../common/mail/mail.service';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { CreateUserDto, LoginDto } from '../../common/dto/user.dto';
import { User, UserStatus } from '../../entities';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) { }

  async verifyEmailToken(token: string): Promise<User | null> {
    const user = await this.usersService.findByEmailVerificationToken(token);
    if (!user) return null;
    user.status = UserStatus.ACTIVE;
    user.emailVerificationToken = undefined;
    await this.usersService.save(user);
    return user;
  }

  async register(createUserDto: CreateUserDto): Promise<User> {
    // Generar token de verificación
    const emailVerificationToken = Math.random().toString(36).substring(2) + Date.now().toString(36);
    // Crear usuario con status pendiente de verificación y token
    const user = await this.usersService.create({
      ...createUserDto,
      status: UserStatus.PENDING_VERIFICATION,
      emailVerificationToken,
    });
    // Enviar correo de verificación
    await this.mailService.sendVerificationEmail(user.email, emailVerificationToken);
    return user;
  }

  async login(loginDto: LoginDto): Promise<{ access_token: string; user: Omit<User, 'password'> }> {
    const user = await this.usersService.findByEmailWithPassword(loginDto.email);
    if (!user) throw new UnauthorizedException('Credenciales incorrectas');

    if (user.status !== UserStatus.ACTIVE) {
      throw new UnauthorizedException(
        'Su cuenta se encuentra inactiva o ha sido bloqueada. Contacte al administrador.',
      );
    }

    const isPasswordValid = await this.usersService.validatePassword(
      loginDto.password,
      user.password,
    );
    if (!isPasswordValid) throw new UnauthorizedException('Credenciales incorrectas');

    const { password, ...userWithoutPassword } = user;

    const payload = { sub: user.id, email: user.email, role: user.role };
    const access_token = this.jwtService.sign(payload);

    return {
      access_token,
      user: userWithoutPassword as Omit<User, 'password'>,
    };
  }

  signToken(payload: Record<string, any>): string {
    return this.jwtService.sign(payload);
  }

  verifyToken(token: string) {
    return this.jwtService.verify(token);
  }

  async validateUser(id: string): Promise<User | null> {
    return this.usersService.findById(id);
  }
}

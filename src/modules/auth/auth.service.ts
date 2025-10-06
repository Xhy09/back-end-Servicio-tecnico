import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { CreateUserDto, LoginDto } from '../../common/dto/user.dto';
import { User, UserStatus } from '../../entities';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<{ access_token: string; user: User }> {
    const user = await this.usersService.create(createUserDto);
    const payload = { 
      sub: user.id, 
      email: user.email, 
      role: user.role 
    };
    
    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }

  async login(loginDto: LoginDto): Promise<{ access_token: string; user: User }> {
    const user = await this.usersService.findByEmailWithPassword(loginDto.email);
    
    if (!user) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    if (user.status !== UserStatus.ACTIVE) {
      throw new UnauthorizedException('Su cuenta se encuentra inactiva o ha sido bloqueada. Contacte al administrador.');
    }

    const isPasswordValid = await this.usersService.validatePassword(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    // Remover password del objeto user antes de devolverlo
    const { password, ...userWithoutPassword } = user;
    
    const payload = { 
      sub: user.id, 
      email: user.email, 
      role: user.role 
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: userWithoutPassword as User,
    };
  }

  async validateUser(id: string): Promise<User | null> {
    return this.usersService.findById(id);
  }
}
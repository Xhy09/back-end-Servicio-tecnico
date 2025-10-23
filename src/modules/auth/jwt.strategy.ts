import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';

// Extractor híbrido: lee tokens de cookies Y headers Authorization
const cookieOrHeaderExtractor = (req: any) => {
  let token = null;
  
  // 1. Intenta obtener desde cookies
  if (req && req.cookies && req.cookies.token) {
    token = req.cookies.token;
    console.log('🍪 JWT Token extraído desde cookies');
  }
  
  // 2. Si no hay en cookies, intenta desde Authorization header
  if (!token && req && req.headers && req.headers.authorization) {
    const authHeader = req.headers.authorization;
    if (authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
      console.log('📨 JWT Token extraído desde Authorization header');
    }
  }
  
  if (!token) {
    console.log('❌ No se encontró JWT token en cookies ni headers');
  }
  
  return token;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
  ) {
    super({
      jwtFromRequest: cookieOrHeaderExtractor,
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET', 'defaultSecret123'),
    });
  }

  async validate(payload: any) {
    const user = await this.usersService.findById(payload.sub);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
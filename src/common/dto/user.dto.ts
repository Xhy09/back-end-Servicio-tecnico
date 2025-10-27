import { IsEmail, IsNotEmpty, IsString, MinLength, IsOptional, IsEnum, Matches, MaxLength } from 'class-validator';
import { UserRole } from '../../entities';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsOptional()
  @IsString()
  @Matches(/^\d{8}$/, { message: 'El teléfono debe tener exactamente 8 dígitos numéricos' })
  phone?: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  company?: string;

  @IsOptional()
  status?: string;

  @IsOptional()
  emailVerificationToken?: string;
}

export class LoginDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsString()
  @Matches(/^\d{8}$/, { message: 'El teléfono debe tener exactamente 8 dígitos numéricos' })
  phone?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  company?: string;
}
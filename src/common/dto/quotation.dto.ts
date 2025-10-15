import { IsNotEmpty, IsString, IsNumber, IsOptional, IsUUID, IsArray, ValidateNested, IsDateString, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { QuotationStatus } from '../../entities';

// DTO for a user creating a quote *request*
export class CreateQuotationDto {
  @IsNotEmpty()
  @IsUUID()
  serviceId: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  location: string;

  @IsNotEmpty()
  @IsDateString()
  requiredDate: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  photos?: string[];
}

// DTO for the items within a formal quote, used by admins
export class QuotationItemDto {
  @IsNotEmpty()
  @IsString()
  description: string; // e.g., 'Instalación de 3 cámaras' or a product name

  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  @IsNotEmpty()
  @IsNumber()
  unitPrice: number;
}

// DTO for an admin updating/processing a quote
export class UpdateQuotationDto {
  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  terms?: string;

  @IsOptional()
  @IsDateString()
  validUntil?: string;

  @IsOptional()
  @IsEnum(QuotationStatus)
  status?: QuotationStatus;

  @IsOptional()
  @IsNumber()
  subtotal?: number;

  @IsOptional()
  @IsNumber()
  tax?: number;

  @IsOptional()
  @IsNumber()
  total?: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuotationItemDto)
  items?: QuotationItemDto[];
}
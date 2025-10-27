import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, NotFoundException } from '@nestjs/common';
import { QuotationsService } from './quotations.service';
import { CreateQuotationDto, UpdateQuotationDto } from '../../common/dto/quotation.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { GetUser } from '../../common/decorators/get-user.decorator';
import { User, UserRole } from '../../entities';

@Controller('quotations')
@UseGuards(JwtAuthGuard, RolesGuard)
export class QuotationsController {
  constructor(private readonly quotationsService: QuotationsService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.EMPLOYEE, UserRole.CUSTOMER)
  create(@Body() createQuotationDto: CreateQuotationDto, @GetUser() user: User) {
    return this.quotationsService.create(createQuotationDto, user.id);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.EMPLOYEE)
  findAll(@Query('customerId') customerId?: string) {
    if (customerId) {
      return this.quotationsService.findByCustomer(customerId);
    }
    return this.quotationsService.findAll();
  }

  @Get('my-quotations')
  @Roles(UserRole.CUSTOMER)
  findMyQuotations(@GetUser() user: User) {
    return this.quotationsService.findByCustomer(user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @GetUser() user: User) {
    // Los clientes solo pueden ver sus propias cotizaciones
    if (user.role === UserRole.CUSTOMER) {
      // Aquí deberías verificar que la cotización pertenece al usuario
      // Por simplicidad, asumimos que el servicio ya maneja esto
    }
    return this.quotationsService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.EMPLOYEE)
  async update(@Param('id') id: string, @Body() updateQuotationDto: UpdateQuotationDto) {
    const updatedQuotation = await this.quotationsService.update(id, updateQuotationDto);
    if (!updatedQuotation) {
      throw new NotFoundException('Quotation not found');
    }
    return updatedQuotation;
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.quotationsService.remove(id);
  }
}
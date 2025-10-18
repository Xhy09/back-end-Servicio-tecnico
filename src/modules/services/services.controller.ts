import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ServicesService } from './services.service';
import { CreateServiceDto, UpdateServiceDto } from '../../common/dto/service.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { GetUser } from '../../common/decorators/get-user.decorator';
import { User, UserRole } from '../../entities';

@Controller('services')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.EMPLOYEE)
  create(@Body() createServiceDto: CreateServiceDto, @GetUser() user: User) {
    return this.servicesService.create(createServiceDto, user.id);
  }

  @Get()
  findAll(@Query('customerId') customerId?: string, @Query('assignedToId') assignedToId?: string) {
    if (customerId) {
      return this.servicesService.findByCustomer(customerId);
    }
    if (assignedToId) {
      return this.servicesService.findByAssignee(assignedToId);
    }
    return this.servicesService.findAll();
  }

  @Get('my-services')
  @Roles(UserRole.CUSTOMER)
  findMyServices(@GetUser() user: User) {
    return this.servicesService.findByCustomer(user.id);
  }

  @Get('assigned-to-me')
  @Roles(UserRole.ADMIN, UserRole.EMPLOYEE)
  findAssignedToMe(@GetUser() user: User) {
    return this.servicesService.findByAssignee(user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.servicesService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.EMPLOYEE)
  update(@Param('id') id: string, @Body() updateServiceDto: UpdateServiceDto) {
    return this.servicesService.update(id, updateServiceDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.servicesService.remove(id);
  }
}
import { Controller, Get, Param, Query, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../entities';

@Controller('reports')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('monthly')
  @Roles(UserRole.ADMIN, UserRole.EMPLOYEE)
  generateMonthlyReport(
    @Query('year', ParseIntPipe) year: number,
    @Query('month', ParseIntPipe) month: number,
  ) {
    return this.reportsService.generateMonthlyReport(year, month);
  }

  @Get('customer-history/:customerId')
  @Roles(UserRole.ADMIN, UserRole.EMPLOYEE)
  getCustomerHistory(@Param('customerId') customerId: string) {
    return this.reportsService.getCustomerHistory(customerId);
  }

  @Get('dashboard')
  @Roles(UserRole.ADMIN, UserRole.EMPLOYEE)
  getDashboardStats() {
    return this.reportsService.getDashboardStats();
  }
}
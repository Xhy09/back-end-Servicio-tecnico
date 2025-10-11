import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Quotation, Service, User, QuotationStatus, ServiceStatus, UserRole } from '../../entities';

export interface MonthlyReport {
  period: string;
  quotations: {
    total: number;
    approved: number;
    pending: number;
    rejected: number;
    totalAmount: number;
  };
  services: {
    total: number;
    completed: number;
    inProgress: number;
    pending: number;
    totalRevenue: number;
  };
  customers: {
    total: number;
    newThisMonth: number;
  };
}

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Quotation)
    private quotationsRepository: Repository<Quotation>,
    @InjectRepository(Service)
    private servicesRepository: Repository<Service>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async generateMonthlyReport(year: number, month: number): Promise<MonthlyReport> {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    // Estadísticas de cotizaciones
    const quotations = await this.quotationsRepository.find({
      where: {
        createdAt: Between(startDate, endDate)
      }
    });

    const quotationStats = {
      total: quotations.length,
      approved: quotations.filter(q => q.status === QuotationStatus.APPROVED).length,
      pending: quotations.filter(q => q.status === QuotationStatus.SENT).length,
      rejected: quotations.filter(q => q.status === QuotationStatus.REJECTED).length,
      totalAmount: quotations
        .filter(q => q.status === QuotationStatus.APPROVED)
        .reduce((sum, q) => sum + Number(q.total), 0)
    };

    // Estadísticas de servicios
    const services = await this.servicesRepository.find({
      where: {
        createdAt: Between(startDate, endDate)
      }
    });

    const serviceStats = {
      total: services.length,
      completed: services.filter(s => s.status === ServiceStatus.COMPLETED).length,
      inProgress: services.filter(s => s.status === ServiceStatus.IN_PROGRESS).length,
      pending: services.filter(s => s.status === ServiceStatus.PENDING).length,
      totalRevenue: services
        .filter(s => s.status === ServiceStatus.COMPLETED && s.finalCost)
        .reduce((sum, s) => sum + Number(s.finalCost), 0)
    };

    // Estadísticas de clientes
    const allCustomers = await this.usersRepository.count({
      where: { role: UserRole.CUSTOMER }
    });

    const newCustomers = await this.usersRepository.count({
      where: {
        role: UserRole.CUSTOMER,
        createdAt: Between(startDate, endDate)
      }
    });

    return {
      period: `${year}-${month.toString().padStart(2, '0')}`,
      quotations: quotationStats,
      services: serviceStats,
      customers: {
        total: allCustomers,
        newThisMonth: newCustomers
      }
    };
  }

  async getCustomerHistory(customerId: string) {
    const quotations = await this.quotationsRepository.find({
      where: { customerId },
      relations: ['items', 'items.product'],
      order: { createdAt: 'DESC' }
    });

    const services = await this.servicesRepository.find({
      where: { customerId },
      relations: ['images'],
      order: { createdAt: 'DESC' }
    });

    return {
      quotations,
      services
    };
  }

  async getDashboardStats() {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    // Cotizaciones pendientes
    const pendingQuotations = await this.quotationsRepository.count({
      where: { status: QuotationStatus.SENT }
    });

    // Servicios activos
    const activeServices = await this.servicesRepository.count({
      where: { status: ServiceStatus.IN_PROGRESS }
    });

    // Ingresos del mes
    const monthlyRevenue = await this.servicesRepository
      .createQueryBuilder('service')
      .select('SUM(service.finalCost)', 'sum')
      .where('service.status = :status', { status: ServiceStatus.COMPLETED })
      .andWhere('service.actualEndDate >= :startDate', { startDate: startOfMonth })
      .getRawOne();

    // Clientes totales
    const totalCustomers = await this.usersRepository.count({
      where: { role: UserRole.CUSTOMER }
    });

    return {
      pendingQuotations,
      activeServices,
      monthlyRevenue: Number(monthlyRevenue?.sum || 0),
      totalCustomers
    };
  }
}
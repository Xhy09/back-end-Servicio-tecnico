import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Service, User, UserRole } from '../../entities';
import { CreateServiceDto, UpdateServiceDto } from '../../common/dto/service.dto';

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(Service)
    private servicesRepository: Repository<Service>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createServiceDto: CreateServiceDto, userId: string): Promise<Service> {
    // Verificar que el cliente existe
    const customer = await this.usersRepository.findOne({
      where: { id: createServiceDto.customerId, role: UserRole.CUSTOMER }
    });

    if (!customer) {
      throw new NotFoundException('Cliente no encontrado');
    }

    // Si se asigna a alguien, verificar que existe
    if (createServiceDto.assignedToId) {
      const assignedUser = await this.usersRepository.findOne({
        where: { id: createServiceDto.assignedToId }
      });

      if (!assignedUser || (assignedUser.role !== UserRole.ADMIN && assignedUser.role !== UserRole.EMPLOYEE)) {
        throw new NotFoundException('Usuario asignado no encontrado o no válido');
      }
    }

    // Generar número de servicio
    const serviceNumber = await this.generateServiceNumber();

    const service = this.servicesRepository.create({
      ...createServiceDto,
      serviceNumber,
      createdById: userId,
      estimatedEndDate: createServiceDto.estimatedEndDate ? new Date(createServiceDto.estimatedEndDate) : undefined,
    });

    return this.servicesRepository.save(service);
  }

  async findAll(): Promise<Service[]> {
    return this.servicesRepository.find({
      relations: ['customer', 'assignedTo', 'createdBy', 'images'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByCustomer(customerId: string): Promise<Service[]> {
    return this.servicesRepository.find({
      where: { customerId },
      relations: ['customer', 'assignedTo', 'createdBy', 'images'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByAssignee(assignedToId: string): Promise<Service[]> {
    return this.servicesRepository.find({
      where: { assignedToId },
      relations: ['customer', 'assignedTo', 'createdBy', 'images'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Service> {
    const service = await this.servicesRepository.findOne({
      where: { id },
      relations: ['customer', 'assignedTo', 'createdBy', 'images'],
    });

    if (!service) {
      throw new NotFoundException('Servicio no encontrado');
    }

    return service;
  }

  async update(id: string, updateServiceDto: UpdateServiceDto): Promise<Service> {
    const service = await this.findOne(id);

    if (updateServiceDto.customerId) {
      const customer = await this.usersRepository.findOne({
        where: { id: updateServiceDto.customerId, role: UserRole.CUSTOMER }
      });

      if (!customer) {
        throw new NotFoundException('Cliente no encontrado');
      }
    }

    if (updateServiceDto.assignedToId) {
      const assignedUser = await this.usersRepository.findOne({
        where: { id: updateServiceDto.assignedToId }
      });

      if (!assignedUser || (assignedUser.role !== UserRole.ADMIN && assignedUser.role !== UserRole.EMPLOYEE)) {
        throw new NotFoundException('Usuario asignado no encontrado o no válido');
      }
    }

    const updateData: any = { ...updateServiceDto };

    // Convertir fechas de string a Date
    if (updateServiceDto.startDate) {
      updateData.startDate = new Date(updateServiceDto.startDate);
    }
    if (updateServiceDto.estimatedEndDate) {
      updateData.estimatedEndDate = new Date(updateServiceDto.estimatedEndDate);
    }
    if (updateServiceDto.actualEndDate) {
      updateData.actualEndDate = new Date(updateServiceDto.actualEndDate);
    }

    await this.servicesRepository.update(id, updateData);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const service = await this.findOne(id);
    await this.servicesRepository.remove(service);
  }

  private async generateServiceNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const count = await this.servicesRepository.count();
    return `SRV-${year}-${(count + 1).toString().padStart(3, '0')}`;
  }
}
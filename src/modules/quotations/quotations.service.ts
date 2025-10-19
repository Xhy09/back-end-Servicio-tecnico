import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Quotation, User, Service, QuotationItem, Status } from '../../entities';
import { CreateQuotationDto, UpdateQuotationDto } from '../../common/dto/quotation.dto';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
import { AuditAction } from '../../entities/audit-log.entity';

@Injectable()
export class QuotationsService {
  constructor(
    @InjectRepository(Quotation)
    private quotationsRepository: Repository<Quotation>,
    @InjectRepository(QuotationItem)
    private quotationItemsRepository: Repository<QuotationItem>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Status)
    private statusRepository: Repository<Status>,
    private auditLogsService: AuditLogsService,
  ) {}

  async create(createQuotationDto: CreateQuotationDto, userId: string): Promise<Quotation> {
    const { serviceId, description, location, requiredDate, photos } = createQuotationDto;

    const customer = await this.usersRepository.findOneBy({ id: userId });
    if (!customer) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const quotationNumber = await this.generateQuotationNumber();
    const pendingStatus = await this.statusRepository.findOneBy({ name: 'Pendiente' });
    if (!pendingStatus) {
      throw new NotFoundException('Estado "Pendiente" no encontrado. Asegúrese de que los estados iniciales estén configurados.');
    }

    const newQuotation = this.quotationsRepository.create({
      quotationNumber,
      customerId: userId,
      createdById: userId,
      notes: `Solicitud de cotización para el servicio ID: ${serviceId}.\n\nDescripción del cliente:\n${description}`,
      location,
      requiredDate: new Date(requiredDate),
      photos,
      status: pendingStatus,
      statusId: pendingStatus.id,
      subtotal: 0,
      tax: 0,
      total: 0,
    });

    return this.quotationsRepository.save(newQuotation);
  }

  async findAll(): Promise<Quotation[]> {
    return this.quotationsRepository.find({
      relations: ['customer', 'createdBy', 'items'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByCustomer(customerId: string): Promise<Quotation[]> {
    return this.quotationsRepository.find({
      where: { customerId },
      relations: ['customer', 'createdBy', 'items'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Quotation> {
    const quotation = await this.quotationsRepository.findOne({
      where: { id },
      relations: ['customer', 'createdBy', 'items'],
    });

    if (!quotation) {
      throw new NotFoundException('Cotización no encontrada');
    }

    return quotation;
  }

  async update(id: string, updateQuotationDto: UpdateQuotationDto): Promise<Quotation> {
    const existingQuotation = await this.quotationsRepository.findOne({
      where: { id },
      relations: ['status', 'createdBy'], // Ensure status and createdBy are loaded
    });

    if (!existingQuotation) {
      throw new NotFoundException('Cotización no encontrada');
    }

    if (updateQuotationDto.statusId && updateQuotationDto.statusId !== existingQuotation.status.id) {
      const newStatus = await this.statusRepository.findOneBy({ id: updateQuotationDto.statusId });
      if (!newStatus) {
        throw new NotFoundException('Nuevo estado no encontrado.');
      }

      const isValidTransition = this.validateStatusTransition(
        existingQuotation.status.name, // Pass the name of the current status
        newStatus.name, // Pass the name of the new status
      );
      if (!isValidTransition) {
        throw new BadRequestException(
          `Transición de estado inválida de ${existingQuotation.status.name} a ${newStatus.name}`,
        );
      }

      // Log the status change
      await this.auditLogsService.createLog(
        AuditAction.UPDATE_QUOTATION_STATUS,
        'Quotation',
        id,
        existingQuotation.createdBy.id,
        { status: existingQuotation.status.name },
        { status: newStatus.name },
      );
      // Update the status relation and ID
      existingQuotation.status = newStatus;
      existingQuotation.statusId = newStatus.id;
    }

    const { items, statusId, ...quotationData } = updateQuotationDto; // Exclude statusId from direct update

    // Apply other updates from quotationData to existingQuotation
    Object.assign(existingQuotation, quotationData);

    // Save the updated quotation
    await this.quotationsRepository.save(existingQuotation);

    if (items) {
      await this.quotationItemsRepository.delete({ quotationId: id });

      let calculatedSubtotal = 0;
      const newItems = items.map(itemDto => {
        const itemSubtotal = itemDto.quantity * itemDto.unitPrice;
        calculatedSubtotal += itemSubtotal;
        return this.quotationItemsRepository.create({
          ...itemDto,
          subtotal: itemSubtotal,
          quotationId: id,
        });
      });

      await this.quotationItemsRepository.save(newItems);

      // Update subtotal and total in quotationData
      quotationData.subtotal = calculatedSubtotal;
      // Assuming tax is 0 for now, or apply a default tax rate if available
      quotationData.tax = quotationData.tax ?? 0; // Keep existing tax if not provided, otherwise default to 0
      quotationData.total = calculatedSubtotal + quotationData.tax;
    }

    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const quotation = await this.findOne(id);
    await this.quotationsRepository.remove(quotation);
  }

  private validateStatusTransition(currentStatusName: string, newStatusName: string): boolean {
    // Allow any status to transition to 'Finalizado'
    if (newStatusName === 'Finalizado') {
      return true;
    }

    switch (currentStatusName) {
      case 'Pendiente':
        return newStatusName === 'Iniciado';
      case 'Iniciado':
        return newStatusName === 'En Proceso';
      case 'En Proceso':
        return newStatusName === 'Finalizado'; // This case is already covered by the first if, but kept for clarity
          case 'Finalizado':
              return newStatusName === 'Iniciado'; // Allow reopening a finalized quotation
          default:
              return false;
          }  }

  private async generateQuotationNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const count = await this.quotationsRepository.count();
    return `COT-${year}-${(count + 1).toString().padStart(3, '0')}`;
  }
}

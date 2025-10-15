import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Quotation, User, Service, QuotationStatus, QuotationItem } from '../../entities';
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
    private auditLogsService: AuditLogsService,
  ) {}

  async create(createQuotationDto: CreateQuotationDto, userId: string): Promise<Quotation> {
    const { serviceId, description, location, requiredDate, photos } = createQuotationDto;

    const customer = await this.usersRepository.findOneBy({ id: userId });
    if (!customer) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const quotationNumber = await this.generateQuotationNumber();

    const newQuotation = this.quotationsRepository.create({
      quotationNumber,
      customerId: userId,
      createdById: userId,
      notes: `Solicitud de cotización para el servicio ID: ${serviceId}.\n\nDescripción del cliente:\n${description}`,
      location,
      requiredDate: new Date(requiredDate),
      photos,
      status: QuotationStatus.SENT,
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
    const existingQuotation = await this.findOne(id);

    if (updateQuotationDto.status && updateQuotationDto.status !== existingQuotation.status) {
      const isValidTransition = this.validateStatusTransition(
        existingQuotation.status,
        updateQuotationDto.status,
      );
      if (!isValidTransition) {
        throw new BadRequestException(
          `Transición de estado inválida de ${existingQuotation.status} a ${updateQuotationDto.status}`,
        );
      }

      // Log the status change
      await this.auditLogsService.createLog(
        AuditAction.UPDATE_QUOTATION_STATUS,
        'Quotation',
        id,
        existingQuotation.createdBy.id, // Assuming the user performing the action is the creator for now
        { status: existingQuotation.status },
        { status: updateQuotationDto.status },
      );
    }

    const { items, ...quotationData } = updateQuotationDto;

    await this.quotationsRepository.update(id, quotationData);

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

  private validateStatusTransition(currentStatus: QuotationStatus, newStatus: QuotationStatus): boolean {
    switch (currentStatus) {
      case QuotationStatus.DRAFT:
        return newStatus === QuotationStatus.SENT || newStatus === QuotationStatus.REJECTED;
      case QuotationStatus.SENT:
        return newStatus === QuotationStatus.APPROVED || newStatus === QuotationStatus.REJECTED;
      case QuotationStatus.APPROVED:
        return newStatus === QuotationStatus.IN_PROGRESS || newStatus === QuotationStatus.REJECTED;
      case QuotationStatus.IN_PROGRESS:
        return newStatus === QuotationStatus.COMPLETED || newStatus === QuotationStatus.REJECTED;
      case QuotationStatus.COMPLETED:
      case QuotationStatus.REJECTED:
      case QuotationStatus.EXPIRED:
        return false; // No further transitions from these final states
      default:
        return false;
    }
  }

  private async generateQuotationNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const count = await this.quotationsRepository.count();
    return `COT-${year}-${(count + 1).toString().padStart(3, '0')}`;
  }
}

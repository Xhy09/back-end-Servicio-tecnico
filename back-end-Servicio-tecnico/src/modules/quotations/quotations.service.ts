import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Quotation, QuotationItem, Product, User, UserRole } from '../../entities';
import { CreateQuotationDto, UpdateQuotationDto } from '../../common/dto/quotation.dto';

@Injectable()
export class QuotationsService {
  constructor(
    @InjectRepository(Quotation)
    private quotationsRepository: Repository<Quotation>,
    @InjectRepository(QuotationItem)
    private quotationItemsRepository: Repository<QuotationItem>,
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createQuotationDto: CreateQuotationDto, userId: string): Promise<Quotation> {
    // Verificar que el cliente existe
    const customer = await this.usersRepository.findOne({
      where: { id: createQuotationDto.customerId, role: UserRole.CUSTOMER }
    });

    if (!customer) {
      throw new NotFoundException('Cliente no encontrado');
    }

    // Verificar que todos los productos existen y calcular totales
    let subtotal = 0;
    const itemsData: any[] = [];

    for (const item of createQuotationDto.items) {
      const product = await this.productsRepository.findOne({
        where: { id: item.productId }
      });

      if (!product) {
        throw new NotFoundException(`Producto ${item.productId} no encontrado`);
      }

      const itemSubtotal = item.quantity * item.unitPrice;
      subtotal += itemSubtotal;

      itemsData.push({
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        notes: item.notes,
        subtotal: itemSubtotal,
      });
    }

    // Calcular impuestos (ejemplo: 16% IVA)
    const tax = subtotal * 0.16;
    const total = subtotal + tax;

    // Generar número de cotización
    const quotationNumber = await this.generateQuotationNumber();

    // Crear la cotización
    const quotation = this.quotationsRepository.create({
      quotationNumber,
      customerId: createQuotationDto.customerId,
      createdById: userId,
      notes: createQuotationDto.notes,
      terms: createQuotationDto.terms,
      validUntil: createQuotationDto.validUntil ? new Date(createQuotationDto.validUntil) : undefined,
      subtotal,
      tax,
      total,
    });

    const savedQuotation = await this.quotationsRepository.save(quotation);

    // Crear los items de la cotización
    const quotationItems = itemsData.map(item => 
      this.quotationItemsRepository.create({
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        notes: item.notes,
        subtotal: item.subtotal,
        quotationId: savedQuotation.id,
      })
    );

    await this.quotationItemsRepository.save(quotationItems);

    return this.findOne(savedQuotation.id);
  }

  async findAll(): Promise<Quotation[]> {
    return this.quotationsRepository.find({
      relations: ['customer', 'createdBy', 'items', 'items.product'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByCustomer(customerId: string): Promise<Quotation[]> {
    return this.quotationsRepository.find({
      where: { customerId },
      relations: ['customer', 'createdBy', 'items', 'items.product'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Quotation> {
    const quotation = await this.quotationsRepository.findOne({
      where: { id },
      relations: ['customer', 'createdBy', 'items', 'items.product', 'items.product.category'],
    });

    if (!quotation) {
      throw new NotFoundException('Cotización no encontrada');
    }

    return quotation;
  }

  async update(id: string, updateQuotationDto: UpdateQuotationDto): Promise<Quotation> {
    const quotation = await this.findOne(id);

    if (updateQuotationDto.customerId) {
      const customer = await this.usersRepository.findOne({
        where: { id: updateQuotationDto.customerId, role: UserRole.CUSTOMER }
      });

      if (!customer) {
        throw new NotFoundException('Cliente no encontrado');
      }
    }

    // Si se actualizan los items, recalcular totales
    if (updateQuotationDto.items) {
      // Eliminar items existentes
      await this.quotationItemsRepository.delete({ quotationId: id });

      let subtotal = 0;
      const itemsData: any[] = [];

      for (const item of updateQuotationDto.items) {
        const product = await this.productsRepository.findOne({
          where: { id: item.productId }
        });

        if (!product) {
          throw new NotFoundException(`Producto ${item.productId} no encontrado`);
        }

        const itemSubtotal = item.quantity * item.unitPrice;
        subtotal += itemSubtotal;

        itemsData.push({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          notes: item.notes,
          subtotal: itemSubtotal,
        });
      }

      const tax = subtotal * 0.16;
      const total = subtotal + tax;

      // Actualizar totales en la cotización
      const { items, ...updateData } = updateQuotationDto;
      await this.quotationsRepository.update(id, {
        ...updateData,
        subtotal,
        tax,
        total,
      });

      // Crear los nuevos items
      const quotationItems = itemsData.map(item => 
        this.quotationItemsRepository.create({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          notes: item.notes,
          subtotal: item.subtotal,
          quotationId: id,
        })
      );

      await this.quotationItemsRepository.save(quotationItems);
    } else {
      // Solo actualizar los campos básicos
      await this.quotationsRepository.update(id, updateQuotationDto);
    }

    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const quotation = await this.findOne(id);
    await this.quotationsRepository.remove(quotation);
  }

  private async generateQuotationNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const count = await this.quotationsRepository.count();
    return `COT-${year}-${(count + 1).toString().padStart(3, '0')}`;
  }
}
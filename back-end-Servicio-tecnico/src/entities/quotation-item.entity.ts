import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Quotation } from './quotation.entity';
import { Product } from './product.entity';

@Entity('quotation_items')
export class QuotationItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  unitPrice: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  subtotal: number; // quantity * unitPrice

  @Column({ type: 'text', nullable: true })
  notes?: string;

  // Relaciones
  @ManyToOne(() => Quotation, quotation => quotation.items, { onDelete: 'CASCADE' })
  quotation: Quotation;

  @Column({ name: 'quotationId' })
  quotationId: string;

  @ManyToOne(() => Product)
  product: Product;

  @Column({ name: 'productId' })
  productId: string;
}
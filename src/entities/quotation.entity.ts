import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from './user.entity';
import { QuotationItem } from './quotation-item.entity';

export enum QuotationStatus {
  DRAFT = 'draft',
  SENT = 'sent',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  EXPIRED = 'expired'
}

@Entity('quotations')
export class Quotation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 20 })
  quotationNumber: string; // COT-2024-001

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @Column({ length: 255, nullable: true })
  location?: string;

  @Column({ type: 'date', nullable: true })
  requiredDate?: Date;

  @Column({ type: 'simple-array', nullable: true })
  photos?: string[];

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  subtotal: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  tax: number; // Impuestos

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total: number;

  @Column({ type: 'enum', enum: QuotationStatus, default: QuotationStatus.DRAFT })
  status: QuotationStatus;

  @Column({ type: 'date', nullable: true })
  validUntil?: Date;

  @Column({ type: 'text', nullable: true })
  terms?: string; // Términos y condiciones

  @Column({ length: 500, nullable: true })
  pdfUrl?: string; // URL del PDF generado

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relaciones
  @ManyToOne(() => User, user => user.quotations)
  customer: User;

  @Column({ name: 'customerId' })
  customerId: string;

  @ManyToOne(() => User)
  createdBy: User;

  @Column({ name: 'createdById' })
  createdById: string;

  @OneToMany(() => QuotationItem, item => item.quotation, { cascade: true })
  items: QuotationItem[];
}
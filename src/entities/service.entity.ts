import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from './user.entity';
import { ServiceImage } from './service-image.entity';

export enum ServiceStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  ON_HOLD = 'on_hold'
}

export enum ServicePriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent'
}

@Entity('services')
export class Service {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 20 })
  serviceNumber: string; // SRV-2024-001

  @Column({ length: 200 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'enum', enum: ServiceStatus, default: ServiceStatus.PENDING })
  status: ServiceStatus;

  @Column({ type: 'enum', enum: ServicePriority, default: ServicePriority.MEDIUM })
  priority: ServicePriority;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  estimatedCost?: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  finalCost?: number;

  @Column({ type: 'date', nullable: true })
  startDate?: Date;

  @Column({ type: 'date', nullable: true })
  estimatedEndDate?: Date;

  @Column({ type: 'date', nullable: true })
  actualEndDate?: Date;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @Column({ type: 'text', nullable: true })
  internalNotes?: string; // Solo para empleados/admin

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relaciones
  @ManyToOne(() => User, user => user.services)
  customer: User;

  @Column({ name: 'customerId' })
  customerId: string;

  @ManyToOne(() => User, { nullable: true })
  assignedTo?: User;

  @Column({ name: 'assignedToId', nullable: true })
  assignedToId?: string;

  @ManyToOne(() => User)
  createdBy: User;

  @Column({ name: 'createdById' })
  createdById: string;

  @OneToMany(() => ServiceImage, image => image.service, { cascade: true })
  images: ServiceImage[];
}
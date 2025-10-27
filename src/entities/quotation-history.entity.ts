import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Quotation } from './quotation.entity';
import { User } from './user.entity';
import { Status } from './status.entity';

@Entity('historial_cotizaciones')
export class QuotationHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Quotation)
  quotation: Quotation;

  @Column({ name: 'quotationId' })
  quotationId: string;

  @ManyToOne(() => User)
  employee: User;

  @Column({ name: 'employeeId' })
  employeeId: string;

  @ManyToOne(() => Status)
  previousStatus: Status;

  @Column({ name: 'previousStatusId', nullable: true })
  previousStatusId?: string;

  @ManyToOne(() => Status)
  newStatus: Status;

  @Column({ name: 'newStatusId' })
  newStatusId: string;

  @Column({ type: 'text', nullable: true })
  comment?: string; // Comentario del empleado sobre el cambio

  @CreateDateColumn()
  changedAt: Date;
}

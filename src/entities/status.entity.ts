import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Quotation } from './quotation.entity';

@Entity('statuses')
export class Status {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 50 })
  name: string;

  @OneToMany(() => Quotation, quotation => quotation.status)
  quotations: Quotation[];
}

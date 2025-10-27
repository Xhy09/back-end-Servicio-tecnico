import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Service } from './service.entity';

@Entity('service_images')
export class ServiceImage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 500 })
  url: string;

  @Column({ length: 200, nullable: true })
  altText?: string;

  @Column({ type: 'int', default: 0 })
  order: number;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'enum', enum: ['before', 'during', 'after'], default: 'after' })
  imageType: 'before' | 'during' | 'after'; // Tipo de imagen del trabajo

  @CreateDateColumn()
  createdAt: Date;

  // Relaciones
  @ManyToOne(() => Service, service => service.images, { onDelete: 'CASCADE' })
  service: Service;

  @Column({ name: 'serviceId' })
  serviceId: string;
}
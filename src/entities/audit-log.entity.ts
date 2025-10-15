import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from './user.entity';

export enum AuditAction {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LOGIN = 'login',
  LOGOUT = 'logout',
  GENERATE_REPORT = 'generate_report',
  SEND_QUOTATION = 'send_quotation',
  UPDATE_QUOTATION_STATUS = 'update_quotation_status'
}

@Entity('audit_logs')
export class AuditLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: AuditAction })
  action: AuditAction;

  @Column({ length: 100 })
  entityName: string; // Nombre de la entidad afectada

  @Column({ nullable: true })
  entityId?: string; // ID del registro afectado

  @Column({ type: 'json', nullable: true })
  oldValues?: any; // Valores anteriores (para updates/deletes)

  @Column({ type: 'json', nullable: true })
  newValues?: any; // Valores nuevos (para creates/updates)

  @Column({ length: 45, nullable: true })
  ipAddress?: string;

  @Column({ length: 500, nullable: true })
  userAgent?: string;

  @CreateDateColumn()
  createdAt: Date;

  // Relaciones
  @ManyToOne(() => User, { nullable: true })
  user?: User;

  @Column({ name: 'userId', nullable: true })
  userId?: string;
}
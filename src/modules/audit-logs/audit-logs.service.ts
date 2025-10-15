import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog, AuditAction } from '../../entities/audit-log.entity';

@Injectable()
export class AuditLogsService {
  constructor(
    @InjectRepository(AuditLog)
    private auditLogsRepository: Repository<AuditLog>,
  ) {}

  async createLog(
    action: AuditAction,
    entityName: string,
    entityId: string,
    userId?: string,
    oldValues?: any,
    newValues?: any,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<AuditLog> {
    const auditLog = this.auditLogsRepository.create({
      action,
      entityName,
      entityId,
      userId,
      oldValues,
      newValues,
      ipAddress,
      userAgent,
    });
    return this.auditLogsRepository.save(auditLog);
  }

  async findByEntityId(entityId: string, entityName: string): Promise<AuditLog[]> {
    return this.auditLogsRepository.find({
      where: { entityId, entityName },
      relations: ['user'], // Load the user who performed the action
      order: { createdAt: 'ASC' },
    });
  }
}

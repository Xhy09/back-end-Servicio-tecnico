import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Status } from '../../entities';

@Injectable()
export class StatusesService {
  constructor(
    @InjectRepository(Status)
    private statusRepository: Repository<Status>,
  ) {}

  findAll(): Promise<Status[]> {
    return this.statusRepository.find();
  }

  async create(statusData: Partial<Status>): Promise<Status> {
    const status = this.statusRepository.create(statusData);
    return await this.statusRepository.save(status);
  }

  async findByName(name: string): Promise<Status | null> {
    return await this.statusRepository.findOne({ where: { name } });
  }
}

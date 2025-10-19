import { Controller, Get } from '@nestjs/common';
import { StatusesService } from './statuses.service';
import { Status } from '../../entities';

@Controller('statuses')
export class StatusesController {
  constructor(private readonly statusesService: StatusesService) {}

  @Get()
  findAll(): Promise<Status[]> {
    return this.statusesService.findAll();
  }
}

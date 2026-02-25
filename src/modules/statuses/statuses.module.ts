import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatusesService } from './statuses.service';
import { StatusesController } from './statuses.controller';
import { Status } from '../../entities';

@Module({
  imports: [TypeOrmModule.forFeature([Status])],
  providers: [StatusesService],
  controllers: [StatusesController],
  exports: [StatusesService],
})
export class StatusesModule {}

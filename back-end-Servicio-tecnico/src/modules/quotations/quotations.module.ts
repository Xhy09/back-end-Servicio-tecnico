import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuotationsService } from './quotations.service';
import { QuotationsController } from './quotations.controller';
import { Quotation, QuotationItem, Product, User } from '../../entities';

@Module({
  imports: [TypeOrmModule.forFeature([Quotation, QuotationItem, Product, User])],
  controllers: [QuotationsController],
  providers: [QuotationsService],
  exports: [QuotationsService],
})
export class QuotationsModule {}
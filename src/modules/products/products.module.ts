import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsService } from './products.service';
import { ProductsController, CategoriesController } from './products.controller';
import { Product, Category, ProductImage } from '../../entities';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Category, ProductImage])],
  controllers: [ProductsController, CategoriesController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}
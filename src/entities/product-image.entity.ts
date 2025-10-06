import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Product } from './product.entity';

@Entity('product_images')
export class ProductImage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 500 })
  url: string;

  @Column({ length: 200, nullable: true })
  altText?: string;

  @Column({ type: 'int', default: 0 })
  order: number; // Para ordenar las imágenes

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  // Relaciones
  @ManyToOne(() => Product, product => product.images, { onDelete: 'CASCADE' })
  product: Product;

  @Column({ name: 'productId' })
  productId: string;
}
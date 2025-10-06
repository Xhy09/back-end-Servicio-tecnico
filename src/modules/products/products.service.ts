import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product, Category } from '../../entities';
import { CreateProductDto, UpdateProductDto, CreateCategoryDto, UpdateCategoryDto } from '../../common/dto/product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}

  // Productos
  async createProduct(createProductDto: CreateProductDto, userId: string): Promise<Product> {
    // Verificar que la categoría existe
    const category = await this.categoriesRepository.findOne({
      where: { id: createProductDto.categoryId }
    });
    
    if (!category) {
      throw new NotFoundException('Categoría no encontrada');
    }

    const product = this.productsRepository.create({
      ...createProductDto,
      createdById: userId,
    });

    return this.productsRepository.save(product);
  }

  async findAllProducts(): Promise<Product[]> {
    return this.productsRepository.find({
      relations: ['category', 'images', 'createdBy'],
      where: { isActive: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findProductById(id: string): Promise<Product> {
    const product = await this.productsRepository.findOne({
      where: { id },
      relations: ['category', 'images', 'createdBy'],
    });

    if (!product) {
      throw new NotFoundException('Producto no encontrado');
    }

    return product;
  }

  async updateProduct(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
    const product = await this.findProductById(id);

    if (updateProductDto.categoryId) {
      const category = await this.categoriesRepository.findOne({
        where: { id: updateProductDto.categoryId }
      });
      
      if (!category) {
        throw new NotFoundException('Categoría no encontrada');
      }
    }

    await this.productsRepository.update(id, updateProductDto);
    return this.findProductById(id);
  }

  async removeProduct(id: string): Promise<void> {
    const product = await this.findProductById(id);
    await this.productsRepository.remove(product);
  }

  // Categorías
  async createCategory(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const existingCategory = await this.categoriesRepository.findOne({
      where: { name: createCategoryDto.name }
    });

    if (existingCategory) {
      throw new ConflictException('Ya existe una categoría con ese nombre');
    }

    const category = this.categoriesRepository.create(createCategoryDto);
    return this.categoriesRepository.save(category);
  }

  async findAllCategories(): Promise<Category[]> {
    return this.categoriesRepository.find({
      where: { isActive: true },
      order: { name: 'ASC' },
    });
  }

  async findCategoryById(id: string): Promise<Category> {
    const category = await this.categoriesRepository.findOne({
      where: { id },
      relations: ['products'],
    });

    if (!category) {
      throw new NotFoundException('Categoría no encontrada');
    }

    return category;
  }

  async updateCategory(id: string, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
    const category = await this.findCategoryById(id);

    if (updateCategoryDto.name) {
      const existingCategory = await this.categoriesRepository.findOne({
        where: { name: updateCategoryDto.name }
      });

      if (existingCategory && existingCategory.id !== id) {
        throw new ConflictException('Ya existe una categoría con ese nombre');
      }
    }

    await this.categoriesRepository.update(id, updateCategoryDto);
    return this.findCategoryById(id);
  }

  async removeCategory(id: string): Promise<void> {
    const category = await this.findCategoryById(id);
    
    // Verificar que no tenga productos asociados
    const productsCount = await this.productsRepository.count({
      where: { categoryId: id }
    });

    if (productsCount > 0) {
      throw new ConflictException('No se puede eliminar una categoría que tiene productos asociados');
    }

    await this.categoriesRepository.remove(category);
  }
}
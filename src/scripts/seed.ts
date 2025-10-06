import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { UsersService } from '../modules/users/users.service';
import { ProductsService } from '../modules/products/products.service';
import { UserRole } from '../entities';
import * as bcrypt from 'bcrypt';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const usersService = app.get(UsersService);
  const productsService = app.get(ProductsService);

  try {
    console.log('🚀 Iniciando seed de la base de datos...');

    // Crear usuario administrador
    try {
      await usersService.create({
        firstName: 'Admin',
        lastName: 'Sistema',
        email: 'admin@empresa.com',
        password: 'admin123',
        role: UserRole.ADMIN,
      });
      console.log('✅ Usuario administrador creado: admin@empresa.com / admin123');
    } catch (error) {
      console.log('⚠️  Usuario administrador ya existe');
    }

    // Crear usuario empleado
    try {
      await usersService.create({
        firstName: 'Juan',
        lastName: 'Empleado',
        email: 'empleado@empresa.com',
        password: 'empleado123',
        role: UserRole.EMPLOYEE,
        phone: '+34612345678',
      });
      console.log('✅ Usuario empleado creado: empleado@empresa.com / empleado123');
    } catch (error) {
      console.log('⚠️  Usuario empleado ya existe');
    }

    // Crear usuario cliente de prueba
    try {
      await usersService.create({
        firstName: 'María',
        lastName: 'Cliente',
        email: 'cliente@gmail.com',
        password: 'cliente123',
        role: UserRole.CUSTOMER,
        phone: '+34687654321',
        company: 'Empresa Cliente S.L.',
        address: 'Calle Principal 123, Madrid',
      });
      console.log('✅ Usuario cliente creado: cliente@gmail.com / cliente123');
    } catch (error) {
      console.log('⚠️  Usuario cliente ya existe');
    }

    // Crear categorías de ejemplo
    try {
      const categoria1 = await productsService.createCategory({
        name: 'Servicios de Mantenimiento',
        description: 'Servicios de mantenimiento general y reparaciones',
      });

      const categoria2 = await productsService.createCategory({
        name: 'Productos de Limpieza',
        description: 'Productos químicos y herramientas de limpieza',
      });

      console.log('✅ Categorías creadas');

      // Crear productos de ejemplo
      const admin = await usersService.findByEmail('admin@empresa.com');
      
      if (admin) {
        await productsService.createProduct({
          name: 'Mantenimiento Integral Mensual',
          description: 'Servicio completo de mantenimiento mensual incluyendo limpieza, revisión y pequeñas reparaciones',
          price: 299.99,
          stock: 100,
          categoryId: categoria1.id,
          sku: 'MNT-001',
          specifications: JSON.stringify({
            duracion: '4 horas',
            incluye: ['Limpieza general', 'Revisión técnica', 'Pequeñas reparaciones'],
            garantia: '30 días'
          })
        }, admin.id);

        await productsService.createProduct({
          name: 'Reparación de Fontanería',
          description: 'Servicio de reparación de fontanería básica y avanzada',
          price: 89.50,
          stock: 50,
          categoryId: categoria1.id,
          sku: 'RPR-001',
        }, admin.id);

        await productsService.createProduct({
          name: 'Detergente Industrial',
          description: 'Detergente industrial concentrado para limpieza profunda',
          price: 24.99,
          stock: 200,
          categoryId: categoria2.id,
          sku: 'DET-001',
          weight: 5.0,
        }, admin.id);

        console.log('✅ Productos de ejemplo creados');
      }

    } catch (error) {
      console.log('⚠️  Algunas categorías o productos ya existen');
    }

    console.log('🎉 Seed completado exitosamente!');
    console.log('');
    console.log('📋 Usuarios creados:');
    console.log('   👨‍💼 Admin: admin@empresa.com / admin123');
    console.log('   👷‍♂️ Empleado: empleado@empresa.com / empleado123');
    console.log('   👤 Cliente: cliente@gmail.com / cliente123');
    console.log('');
    console.log('🛍️  Se han creado categorías y productos de ejemplo');

  } catch (error) {
    console.error('❌ Error durante el seed:', error);
  } finally {
    await app.close();
  }
}

bootstrap();
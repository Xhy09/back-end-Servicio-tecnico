import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { UsersService } from '../modules/users/users.service';
import { ProductsService } from '../modules/products/products.service';
import { ServicesService } from '../modules/services/services.service';
import { UserRole, ServiceStatus, ServicePriority } from '../entities';
// import * as bcrypt from 'bcrypt'; // No se usa, lo removí

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const usersService = app.get(UsersService);
  const productsService = app.get(ProductsService);
  const servicesService = app.get(ServicesService);

  try {
    console.log('🚀 Iniciando seed de la base de datos...');

    // Crear usuario administrador
    try {
      await usersService.create({
        firstName: 'Admin',
        lastName: 'Sistema',
        email: 'admin@tedics.com',
        password: 'tedics123',
        role: UserRole.ADMIN,
      });
      console.log('✅ Usuario administrador creado: admin@tedics.com / tedics123');
    } catch (error) {
      console.log('⚠️  Usuario administrador ya existe');
    }

    // Crear usuario empleado
    try {
      await usersService.create({
        firstName: 'Juan',
        lastName: 'Empleado',
        email: 'empleado@tedics.com',
        password: 'empleado123',
        role: UserRole.EMPLOYEE,
        phone: '+34612345678',
      });
      console.log('✅ Usuario empleado creado: empleado@tedics.com / empleado123');
    } catch (error) {
      console.log('⚠️  Usuario empleado ya existe');
    }

    // Crear usuario cliente de prueba (regular user)
    try {
      await usersService.create({
        firstName: 'María',
        lastName: 'Cliente',
        email: 'user@tedics.com',
        password: 'tedics123',
        role: UserRole.CUSTOMER,
        phone: '+34687654321',
        company: 'Empresa Cliente S.L.',
        address: 'Calle Principal 123, Madrid',
      });
      console.log('✅ Usuario cliente creado: user@tedics.com / tedics123');
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
      const admin = await usersService.findByEmail('admin@tedics.com');

      if (admin) {
        await productsService.createProduct(
          {
            name: 'Mantenimiento Integral Mensual',
            description:
              'Servicio completo de mantenimiento mensual incluyendo limpieza, revisión y pequeñas reparaciones',
            price: 299.99,
            stock: 100,
            categoryId: categoria1.id,
            sku: 'MNT-001',
            specifications: JSON.stringify({
              duracion: '4 horas',
              incluye: ['Limpieza general', 'Revisión técnica', 'Pequeñas reparaciones'],
              garantia: '30 días',
            }),
          },
          admin.id,
        );

        await productsService.createProduct(
          {
            name: 'Reparación de Fontanería',
            description: 'Servicio de reparación de fontanería básica y avanzada',
            price: 89.5,
            stock: 50,
            categoryId: categoria1.id,
            sku: 'RPR-001',
          },
          admin.id,
        );

        await productsService.createProduct(
          {
            name: 'Detergente Industrial',
            description: 'Detergente industrial concentrado para limpieza profunda',
            price: 24.99,
            stock: 200,
            categoryId: categoria2.id,
            sku: 'DET-001',
            weight: 5.0,
          },
          admin.id,
        );

        console.log('✅ Productos de ejemplo creados');
      }
    } catch (error) {
      console.log('⚠️  Algunas categorías o productos ya existen');
    }

    // Crear servicios de ejemplo
    try {
      const customer = await usersService.findByEmail('user@tedics.com');
      if (customer) {
        await servicesService.create(
          {
            title: 'Instalación Eléctrica Residencial',
            description:
              'Servicio completo de instalación eléctrica para nuevas construcciones o remodelaciones.',
            customerId: customer.id,
            status: ServiceStatus.PENDING,
            priority: ServicePriority.HIGH, // <-- aquí estaba el problema
          },
          customer.id,
        );

        await servicesService.create(
          {
            title: 'Mantenimiento Preventivo de Redes',
            description:
              'Asegura la continuidad operativa de tu empresa con nuestro plan de mantenimiento preventivo.',
            customerId: customer.id,
            status: ServiceStatus.IN_PROGRESS,
            priority: ServicePriority.MEDIUM,
          },
          customer.id,
        );

        console.log('✅ Servicios de ejemplo creados');
      }
    } catch (error) {
      console.log('⚠️  Algunos servicios ya existen');
    }

    console.log('🎉 Seed completado exitosamente!');
    console.log('');
    console.log('📋 Usuarios creados:');
    console.log('   👨‍💼 Admin: admin@tedics.com / tedics123');
    console.log('   👷‍♂️ Empleado: empleado@tedics.com / empleado123');
    console.log('   👤 Cliente: user@tedics.com / tedics123');
    console.log('');
    console.log('🛍️  Se han creado categorías, productos y servicios de ejemplo');
  } catch (error) {
    console.error('❌ Error durante el seed:', error);
  } finally {
    await app.close();
  }
}

bootstrap();

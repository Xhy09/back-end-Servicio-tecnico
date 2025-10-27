import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { UsersService } from '../modules/users/users.service';
import { ProductsService } from '../modules/products/products.service';
import { ServicesService } from '../modules/services/services.service';
import { StatusesService } from '../modules/statuses/statuses.service';
import { UserRole, ServiceStatus, ServicePriority } from '../entities';
// import * as bcrypt from 'bcrypt'; // No se usa, lo removí

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const usersService = app.get(UsersService);
  const productsService = app.get(ProductsService);
  const servicesService = app.get(ServicesService);
  const statusesService = app.get(StatusesService);

  try {
    console.log('🚀 Iniciando seed de la base de datos...');

    // Crear estados para cotizaciones y servicios
    try {
      const statuses = [
        { name: 'Pendiente', color: '#FFA500', description: 'Cotización o servicio pendiente de revisión' },
        { name: 'Aprobada', color: '#28A745', description: 'Cotización aprobada por el cliente' },
        { name: 'Rechazada', color: '#DC3545', description: 'Cotización rechazada' },
        { name: 'En Proceso', color: '#007BFF', description: 'Servicio en proceso de ejecución' },
        { name: 'Completada', color: '#28A745', description: 'Servicio completado exitosamente' },
        { name: 'Cancelada', color: '#6C757D', description: 'Cotización o servicio cancelado' },
      ];

      for (const status of statuses) {
        try {
          await statusesService.create(status);
        } catch (error) {
          // Si el estado ya existe, continuar
        }
      }
      console.log('✅ Estados creados: Pendiente, Aprobada, Rechazada, En Proceso, Completada, Cancelada');
    } catch (error) {
      console.log('⚠️  Error al crear estados:', error.message);
    }

    // Crear usuario administrador
    try {
      // Intentar eliminar el usuario admin si existe
      const existingAdmin = await usersService.findByEmail('admin@tedics.com');
      if (existingAdmin) {
        await usersService.remove(existingAdmin.id);
        console.log('🔄 Usuario administrador anterior eliminado');
      }

      await usersService.create({
        firstName: 'Admin',
        lastName: 'Sistema',
        email: 'admin@tedics.com',
        password: '123456',
        role: UserRole.ADMIN,
      });
      console.log('✅ Usuario administrador creado: admin@tedics.com / 123456');
    } catch (error) {
      console.log('⚠️  Error al crear usuario administrador:', error.message);
    }

    // Crear usuario empleado
    try {
      // Intentar eliminar el usuario empleado si existe
      const existingEmployee = await usersService.findByEmail('empleado@tedics.com');
      if (existingEmployee) {
        await usersService.remove(existingEmployee.id);
        console.log('🔄 Usuario empleado anterior eliminado');
      }

      await usersService.create({
        firstName: 'Juan',
        lastName: 'Empleado',
        email: 'empleado@tedics.com',
        password: '123456',
        role: UserRole.EMPLOYEE,
        phone: '+34612345678',
      });
      console.log('✅ Usuario empleado creado: empleado@tedics.com / 123456');
    } catch (error) {
      console.log('⚠️  Error al crear usuario empleado:', error.message);
    }

    // Crear usuario cliente de prueba (regular user)
    try {
      // Intentar eliminar el usuario cliente si existe
      const existingCustomer = await usersService.findByEmail('user@tedics.com');
      if (existingCustomer) {
        await usersService.remove(existingCustomer.id);
        console.log('🔄 Usuario cliente anterior eliminado');
      }

      await usersService.create({
        firstName: 'María',
        lastName: 'Cliente',
        email: 'user@tedics.com',
        password: '123456',
        role: UserRole.CUSTOMER,
        phone: '+34687654321',
        company: 'Empresa Cliente S.L.',
        address: 'Calle Principal 123, Madrid',
      });
      console.log('✅ Usuario cliente creado: user@tedics.com / 123456');
    } catch (error) {
      console.log('⚠️  Error al crear usuario cliente:', error.message);
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
        // Servicios TEDICS
        const serviciosTEDICS = [
          {
            serviceNumber: 'SVC-001',
            title: 'Instalaciones Eléctricas',
            description: 'Instalación y mantenimiento de redes eléctricas en viviendas y empresas. Mejoras de infraestructura eléctrica.',
            status: ServiceStatus.PENDING,
            priority: ServicePriority.MEDIUM,
            estimatedCost: 1000,
            finalCost: null,
            createdAt: new Date('2025-10-25T00:00:00Z'),
            customerId: customer.id
          },
          {
            serviceNumber: 'SVC-002',
            title: 'Mantenimiento Industrial',
            description: 'Revisión y reparación de sistemas eléctricos industriales. Mantenimiento preventivo y correctivo de maquinaria eléctrica.',
            status: ServiceStatus.PENDING,
            priority: ServicePriority.HIGH,
            estimatedCost: 2000,
            finalCost: null,
            createdAt: new Date('2025-10-25T00:00:00Z'),
            customerId: customer.id
          },
          {
            serviceNumber: 'SVC-003',
            title: 'Aire Acondicionado',
            description: 'Instalación y mantenimiento de equipos de climatización. Limpieza y reparación de sistemas de aire acondicionado.',
            status: ServiceStatus.PENDING,
            priority: ServicePriority.MEDIUM,
            estimatedCost: 1500,
            finalCost: null,
            createdAt: new Date('2025-10-25T00:00:00Z'),
            customerId: customer.id
          },
          {
            serviceNumber: 'SVC-004',
            title: 'Cámaras de Vigilancia (Seguridad)',
            description: 'Instalación de cámaras de seguridad y sistemas de CCTV. Configuración de monitoreo remoto.',
            status: ServiceStatus.PENDING,
            priority: ServicePriority.HIGH,
            estimatedCost: 1800,
            finalCost: null,
            createdAt: new Date('2025-10-25T00:00:00Z'),
            customerId: customer.id
          },
          {
            serviceNumber: 'SVC-005',
            title: 'Sistemas de Sonido',
            description: 'Instalación de equipos de audio profesional y residencial. Configuración de sistemas de sonido y altavoces.',
            status: ServiceStatus.PENDING,
            priority: ServicePriority.MEDIUM,
            estimatedCost: 1200,
            finalCost: null,
            createdAt: new Date('2025-10-25T00:00:00Z'),
            customerId: customer.id
          },
          {
            serviceNumber: 'SVC-006',
            title: 'Línea Blanca',
            description: 'Instalación y reparación de electrodomésticos. Conexión segura de equipos como lavadoras, refrigeradores, estufas, etc.',
            status: ServiceStatus.PENDING,
            priority: ServicePriority.MEDIUM,
            estimatedCost: 1100,
            finalCost: null,
            createdAt: new Date('2025-10-25T00:00:00Z'),
            customerId: customer.id
          }
        ];
        for (const servicio of serviciosTEDICS) {
          await servicesService.create(servicio, customer.id);
        }
        console.log('✅ Servicios TEDICS creados');
      }
    } catch (error) {
      console.log('⚠️  Algunos servicios ya existen');
    }

    console.log('🎉 Seed completado exitosamente!');
    console.log('');
    console.log('📋 Usuarios creados:');
    console.log('   👨‍💼 Admin: admin@tedics.com / 123456');
    console.log('   👷‍♂️ Empleado: empleado@tedics.com / 123456');
    console.log('   👤 Cliente: user@tedics.com / 123456');
    console.log('');
    console.log('🛍️  Se han creado categorías, productos y servicios de ejemplo');
  } catch (error) {
    console.error('❌ Error durante el seed:', error);
  } finally {
    await app.close();
  }
}

bootstrap();

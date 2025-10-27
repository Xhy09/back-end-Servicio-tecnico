import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { UsersService } from '../modules/users/users.service';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { User } from '../entities';
import { InjectRepository } from '@nestjs/typeorm';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const usersService = app.get(UsersService);

  try {
    console.log('🔧 Actualizando contraseñas de usuarios...');

    // Actualizar contraseña del admin
    const admin = await usersService.findByEmail('admin@tedics.com');
    if (admin) {
      const hashedPassword = await bcrypt.hash('123456', 10);
      await usersService['usersRepository'].update(admin.id, { password: hashedPassword });
      console.log('✅ Contraseña de admin actualizada');
    }

    // Actualizar contraseña del cliente
    const customer = await usersService.findByEmail('user@tedics.com');
    if (customer) {
      const hashedPassword = await bcrypt.hash('123456', 10);
      await usersService['usersRepository'].update(customer.id, { password: hashedPassword });
      console.log('✅ Contraseña de cliente actualizada');
    }

    // Actualizar contraseña del empleado
    const employee = await usersService.findByEmail('empleado@tedics.com');
    if (employee) {
      const hashedPassword = await bcrypt.hash('123456', 10);
      await usersService['usersRepository'].update(employee.id, { password: hashedPassword });
      console.log('✅ Contraseña de empleado actualizada');
    }

    console.log('');
    console.log('🎉 Todas las contraseñas han sido actualizadas exitosamente!');
    console.log('');
    console.log('📋 Usuarios con contraseña actualizada:');
    console.log('   👨‍💼 Admin: admin@tedics.com / 123456');
    console.log('   👷‍♂️ Empleado: empleado@tedics.com / 123456');
    console.log('   👤 Cliente: user@tedics.com / 123456');
  } catch (error) {
    console.error('❌ Error al actualizar contraseñas:', error);
  } finally {
    await app.close();
  }
}

bootstrap();

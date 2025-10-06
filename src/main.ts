import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilitar CORS para el frontend
  app.enableCors({
    origin: ['http://localhost:3001', 'http://localhost:5173'], // Puertos comunes para React/Vue
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Validación global de DTOs
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Remover propiedades no definidas en DTO
    forbidNonWhitelisted: true, // Lanzar error si hay propiedades no permitidas
    transform: true, // Transformar tipos automáticamente
  }));

  // Prefijo global para todas las rutas de la API
  app.setGlobalPrefix('api');

  const port = process.env.PORT || 3000;
  await app.listen(port);
  
  console.log('🚀 Servidor iniciado en puerto:', port);
  console.log('📚 Documentación API disponible en: http://localhost:' + port + '/api');
  console.log('🔗 Base URL de la API: http://localhost:' + port + '/api');
}
bootstrap();

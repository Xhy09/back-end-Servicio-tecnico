import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { 
  User, 
  Product, 
  Category, 
  ProductImage, 
  Quotation, 
  QuotationItem,
  QuotationHistory,
  Service, 
  ServiceImage, 
  AuditLog,
  Status 
} from './entities';

// Importar módulos
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ProductsModule } from './modules/products/products.module';
import { QuotationsModule } from './modules/quotations/quotations.module';
import { ServicesModule } from './modules/services/services.module';
import { ReportsModule } from './modules/reports/reports.module';
import { AuditLogsModule } from './modules/audit-logs/audit-logs.module';
import { StatusesModule } from './modules/statuses/statuses.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST || 'localhost',
      port: parseInt(process.env.DATABASE_PORT || '5432'),
      username: process.env.DATABASE_USERNAME || 'postgres',
      password: process.env.DATABASE_PASSWORD || 'lol11990',
      database: process.env.DATABASE_NAME || 'servicio_tecnico',
      entities: [
        User,
        Product,
        Category,
        ProductImage,
        Quotation,
        QuotationItem,
        QuotationHistory,
        Service,
        ServiceImage,
        AuditLog,
        Status
      ],
      synchronize: process.env.NODE_ENV !== 'production',
      logging: process.env.NODE_ENV === 'development',
      migrations: [__dirname + '/database/migrations/*.ts'],
    }),
    // Módulos de funcionalidades
    AuthModule,
    UsersModule,
    ProductsModule,
    QuotationsModule,
    ServicesModule,
    ReportsModule,
    AuditLogsModule,
    StatusesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

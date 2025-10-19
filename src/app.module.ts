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
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5433'),
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'password',
      database: process.env.DB_NAME || 'business_app',
      entities: [
        User,
        Product,
        Category,
        ProductImage,
        Quotation,
        QuotationItem,
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

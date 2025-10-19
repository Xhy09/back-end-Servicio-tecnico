import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '.env') });

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5433'),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'business_app',
  entities: [
    path.join(__dirname, 'src', 'entities', '*.entity.ts'),
  ],
  migrations: [
    path.join(__dirname, 'src', 'database', 'migrations', '*.ts'),
  ],
  synchronize: false, // Never use synchronize in production
  logging: true,
});

export default AppDataSource;

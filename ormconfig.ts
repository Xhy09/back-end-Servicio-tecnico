import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '.env') });

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5432'),
  username: process.env.DATABASE_USERNAME || 'postgres',
  password: process.env.DATABASE_PASSWORD || '123456',
  database: process.env.DATABASE_NAME || 'db_servicios_tecnicos',
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

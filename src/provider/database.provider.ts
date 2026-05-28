import { SequelizeModuleOptions } from '@nestjs/sequelize';

const DEFAULT_HOST = 'localhost';
const DEFAULT_PORT = 5432;
const DEFAULT_USERNAME = 'postgres';
const DEFAULT_PASSWORD = 'postgres';
const DEFAULT_DATABASE = 'test';

const isDev = process.env.ENVIRONMENT === 'dev';
const allowAlter = process.env.ALLOW_ALTER_TABLE === 'true';
const allowForce = process.env.ALLOW_FORCE_TABLE_RECREATION === 'true';

/**
 * Cấu hình kết nối DB cho SequelizeModule.forRoot.
 * `force=true` sẽ drop & tạo lại bảng — chỉ bật ở môi trường dev.
 */
export const databaseConfig: SequelizeModuleOptions = {
  dialect: 'postgres',
  host: process.env.DATABASE_HOST ?? DEFAULT_HOST,
  port: process.env.DATABASE_PORT ? Number.parseInt(process.env.DATABASE_PORT, 10) : DEFAULT_PORT,
  username: process.env.DATABASE_USERNAME ?? DEFAULT_USERNAME,
  password: process.env.DATABASE_PASSWORD ?? DEFAULT_PASSWORD,
  database: process.env.DATABASE_NAME ?? DEFAULT_DATABASE,
  autoLoadModels: true,
  synchronize: isDev,
  sync: { alter: isDev && allowAlter && !allowForce, force: isDev && allowForce },
  logging: isDev ? console.log : false
};

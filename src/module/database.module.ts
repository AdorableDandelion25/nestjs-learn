import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { databaseConfig } from 'src/provider/database.provider';

@Module({
  imports: [SequelizeModule.forRoot(databaseConfig)]
})
export class DatabaseModule {}

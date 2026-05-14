import { Module } from '@nestjs/common';
import { DatabaseModule } from './database.module';
import { UserModule } from '../feature/user/user.module';

@Module({
  imports: [DatabaseModule, UserModule]
})
export class AppModule {}

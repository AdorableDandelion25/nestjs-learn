import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/module/database.module';
import { UserConcreteService } from './service/user.service';
import { userProviders } from './provider/user.provider';
import { UserController } from './controller/user.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [UserController],
  providers: [
    UserConcreteService,
    ...userProviders
  ]
})
export class UserModule {}

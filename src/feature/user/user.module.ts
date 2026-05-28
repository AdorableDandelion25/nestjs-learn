import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserService } from './service/user.service.base';
import { UserConcreteService } from './service/user.service';
import { UserController } from './controller/user.controller';
import { User } from './entity/user.model';

@Module({
  imports: [SequelizeModule.forFeature([User])],
  controllers: [UserController],
  providers: [
    { provide: UserService, useClass: UserConcreteService }
  ]
})
export class UserModule {}

import { Controller, Get } from '@nestjs/common';
import { UserService } from '../service/user.service.base';
import { User } from '../entity/user.model';

@Controller('users')
export class UserController {
  constructor(
    private readonly service: UserService
  ) {}

  @Get()
  async findAll(): Promise<User[]> {
    return this.service.findAll();
  }
}

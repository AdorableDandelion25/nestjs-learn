import { Controller, Get } from '@nestjs/common';
import type { UserService } from '../service/user.service.base';
import { User } from '../entity/user';

@Controller('users')
export class UserController {
  constructor(
    private readonly service: UserService
  ) {}

  @Get()
  async findAll(): Promise<User[]> {
    return this.service.getAll();
  }
}

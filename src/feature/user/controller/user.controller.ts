import { Controller, Get } from '@nestjs/common';
import { UserService } from '../service/user.service.base';
import { UserResponseDto } from '../dto/user-response.dto';

@Controller('users')
export class UserController {
  constructor(
    private readonly service: UserService
  ) {}

  @Get()
  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.service.findAll();
    return users.map(UserResponseDto.from);
  }
}

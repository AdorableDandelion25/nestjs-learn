import { Inject, Injectable } from '@nestjs/common';
import { UserService } from './user.service.base';
import { User } from '../entity/user';

@Injectable()
export class UserConcreteService implements UserService {
  constructor(
    @Inject('USER_REPOSITORY')
    private readonly repository: typeof User
  ) {}

  async getAll(): Promise<User[]> {
    return this.repository.findAll();
  }
}

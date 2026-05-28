import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import type { Attributes, CreationAttributes } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { UserService } from './user.service.base';
import { User } from '../entity/user.model';

@Injectable()
export class UserConcreteService extends UserService {
  constructor(
    @InjectModel(User)
    private readonly repository: typeof User,
    private readonly sequelize: Sequelize
  ) {
    super();
  }

  async create(data: CreationAttributes<User>): Promise<User> {
    return this.sequelize.transaction(transaction => this.repository.create(data, { transaction }));
  }

  async findAll(): Promise<User[]> {
    return this.repository.findAll();
  }

  async findById(id: string): Promise<User | null> {
    return this.repository.findByPk(id);
  }

  async update(id: string, data: Partial<Attributes<User>>): Promise<[affectedCount: number]> {
    return this.sequelize.transaction(transaction => this.repository.update(data, { where: { id }, transaction }));
  }

  async delete(id: string): Promise<boolean> {
    return this.sequelize.transaction(async transaction => {
      const affected = await this.repository.destroy({ where: { id }, transaction });
      return affected >= 1;
    });
  }
}

import type { CreationOptional } from 'sequelize';
import {
  Column,
  DataType,
  PrimaryKey,
  Table
} from 'sequelize-typescript';
import { BaseEntity } from 'src/base/entity/entity.base';

@Table({ tableName: 'users' })
export class User extends BaseEntity<User> {
  @PrimaryKey
  @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4 })
  declare id: CreationOptional<string>;

  @Column({ allowNull: false, unique: true })
  declare email: string;

  @Column({ allowNull: false })
  declare name: string;

  @Column({ allowNull: false })
  declare password: string;
}

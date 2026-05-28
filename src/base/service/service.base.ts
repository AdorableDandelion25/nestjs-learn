import type { Attributes, CreationAttributes } from 'sequelize';
import type { Model } from 'sequelize-typescript';

/**
 * Hợp đồng CRUD dùng chung. Cố tình không lộ option/transaction của Sequelize
 * ra tầng gọi để Controller/test chỉ phụ thuộc khái niệm nghiệp vụ; mọi thao
 * tác ghi được cài đặt kèm transaction bên trong lớp Concrete.
 */
export abstract class BaseService<T extends Model, ID = string> {
  abstract create(data: CreationAttributes<T>): Promise<T>;
  abstract findAll(): Promise<T[]>;
  abstract findById(id: ID): Promise<T | null>;
  abstract update(id: ID, data: Partial<Attributes<T>>): Promise<[affectedCount: number]>;
  abstract delete(id: ID): Promise<boolean>;
}

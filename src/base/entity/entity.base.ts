import { InferAttributes, InferCreationAttributes } from 'sequelize';
import { Model } from 'sequelize-typescript';

export abstract class BaseEntity<T extends Model> extends Model<InferAttributes<T>, InferCreationAttributes<T>> {}

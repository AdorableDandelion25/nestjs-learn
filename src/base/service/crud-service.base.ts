import type { Model } from 'sequelize-typescript';
import { BaseService } from './service.base';

export abstract class CrudService<T extends Model, ID = string> extends BaseService<T, ID> {}

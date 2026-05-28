import { User } from '../entity/user.model';
import { BaseService } from 'src/base/service/service.base';

export abstract class UserService extends BaseService<User> {}

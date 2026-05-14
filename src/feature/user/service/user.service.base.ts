import { User } from '../entity/user';

export interface UserService {
  getAll(): Promise<User[]>;
}

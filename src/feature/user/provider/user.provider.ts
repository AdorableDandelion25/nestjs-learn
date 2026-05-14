import { User } from '../entity/user';

export const userProviders = [
  {
    provide: 'USER_REPOSITORY',
    useValue: User
  }
];

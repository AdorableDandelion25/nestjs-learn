import { User } from '../entity/user';

export class UserResponseDto {
  id!: string;
  email!: string;
  name!: string;
  createdAt!: Date;

  static from(user: User): UserResponseDto {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt
    };
  }
}

import { ModelCtor, Sequelize, SequelizeOptions } from 'sequelize-typescript';
import { User } from 'src/feature/user/entity/user';

const databaseSettings: SequelizeOptions = {
  dialect: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'password',
  database: 'nest'
} as const;

const models: ModelCtor[] = [
  User
];

export const databaseProviders = [
  {
    provide: 'SEQUELIZE',
    useFactory: async () => {
      const sequelize = new Sequelize(databaseSettings);
      sequelize.addModels(models);
      await sequelize.sync();
      return sequelize;
    }
  }
];

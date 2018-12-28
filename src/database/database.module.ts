import * as path from 'path';
import { TypeOrmModule } from '@nestjs/typeorm';
import config from '../config';

export const DatabaseModule = TypeOrmModule.forRoot({
  type: 'mysql',
  host: config.get('DATABASE_HOST'),
  port: parseInt(config.get('DATABASE_PORT'), 10),
  username: config.get('DATABASE_USERNAME'),
  password: config.get('DATABASE_PASSWORD'),
  database: config.get('DATABASE_DBNAME'),
  synchronize: true,
  logging: false,
  entities: [
    __dirname + '/../entity/*{.ts,.js}',
  ],
});
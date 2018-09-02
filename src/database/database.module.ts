import * as path from 'path';
import { TypeOrmModule } from '@nestjs/typeorm';
import config from '../config';

export const DatabaseModule = TypeOrmModule.forRoot({
  type: 'mysql',
  host: config.get('DATABASE_HOST'),
  port: 62494,
  username: 'root',
  password: 'aptx4869',
  database: 'test',
  synchronize: true,
  logging: false,
  entities: [
    __dirname + '/../entity/*{.ts,.js}',
  ],
});
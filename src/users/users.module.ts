import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from '../entity/user';
import { Cnarea } from '../entity/cnarea';
import { Company } from '../entity/company';

@Module({
  imports: [TypeOrmModule.forFeature([User, Cnarea, Company])],
  controllers: [UsersController],
  providers: [
    UsersService,
  ],
  exports: [
    UsersService,
  ],
})
export class UsersModule {}
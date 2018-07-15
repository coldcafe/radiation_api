import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from '../entity/user';
import { WechatUser } from '../entity/wechatUser';

@Module({
  imports: [TypeOrmModule.forFeature([User, WechatUser])],
  controllers: [UsersController],
  providers: [
    UsersService,
  ],
})
export class UsersModule {}
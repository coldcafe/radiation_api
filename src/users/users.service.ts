import { Injectable, ForbiddenException } from '@nestjs/common';
import { User } from '../entity/user';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CONST } from '../config/constants';
import { ConfigService } from '../config/config.service';
import axios from 'axios';
import * as jwt from 'jsonwebtoken';
import { UpdateUserInoReq, UserListReq } from './users.dto';

@Injectable()
export class UsersService {
  private readonly jwtSecret: string;
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly config: ConfigService,
  ) {
    this.jwtSecret = this.config.get('JWT_SECRET');
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async login(username: string, password: string): Promise<string> {
    let user = await this.userRepository.findOne({ username });

    if (!user) {
      throw new ForbiddenException('用户不存在');
    }

    if (user.password !== password) {
      throw new ForbiddenException('密码错误');
    }

    let payload = {
      id: user.id,
      username: user.username,
      role: user.role,
    };
    let token = jwt.sign(payload, this.jwtSecret);
    return token;
  }

  async registor(username: string, password: string) {
    let user = new User();
    user.username = username;
    user.password = password;
    await user.save();
  }

  async updateUserInfo(userIno: UpdateUserInoReq) {
    let user = await this.userRepository.findOne({ id: userIno.id });
    user.password = userIno.password;
    user.nickname = userIno.nickname;
    await user.save();
  }

  async userList(userListReq: UserListReq): Promise<User[]> {

    let where = {};
    let take = userListReq.limit;
    let skip = (userListReq.page - 1) * take;
    if (userListReq.nickname) {
      where['nickname'] = userListReq.nickname;
    }
    if (userListReq.username) {
      where['username'] = userListReq.username;
    }
    let users = await this.userRepository.find({
      where,
      take,
      skip,
    });
    return users;
  }
}
import { Injectable, ForbiddenException } from '@nestjs/common';
import { User } from '../entity/user';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CONST } from '../config/constants';
import axios from 'axios';
import config from '../config';
import * as jwt from 'jsonwebtoken';
import { UpdateUserInoReq, UserListReq, UserDto } from './users.dto';
import { UserInfo } from './users.interface';

@Injectable()
export class UsersService {
  private readonly jwtSecret: string;
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    this.jwtSecret = config.get('JWT_SECRET');
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

    let payload: UserInfo = {
      id: user.id,
      username: user.username,
      role: user.role,
    };
    let token = jwt.sign(payload, this.jwtSecret);
    return token;
  }

  async registor(username: string, password: string) {
    let _user = await this.userRepository.findOne({ username });
    if (_user) {
      throw new ForbiddenException('用户已存在');
    }
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

  async userQuery(userListReq: UserListReq) {
    let { username, nickname, page, limit } = userListReq;
    let where = {};
    if (nickname) {
      where['nickname'] = nickname;
    }
    if (username) {
      where['username'] = username;
    }
    return { where, page, limit };
  }

  async userList(where, page, limit) {
    let users = await this.userRepository.find({
      where,
      take: limit,
      skip: (page - 1) * limit,
    });
    return users;
  }

  async userCount(where) {
    let count = await this.userRepository.count({
      where,
    });
    return count;
  }
}
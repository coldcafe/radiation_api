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

  async userList(userListReq: UserListReq): Promise<UserDto[]> {

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
    return users.map(((user) => {
      let userDto = new UserDto();
      userDto.id = user.id;
      userDto.username = user.username;
      userDto.nickname = user.nickname;
      userDto.role = user.role;
      userDto.createdAt = user.createdAt;
      return userDto;
    }));
  }
}
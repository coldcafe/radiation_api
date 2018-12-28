import { Injectable, ForbiddenException } from '@nestjs/common';
import { User } from '../entity/user';
import { Repository, MoreThan } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CONST } from '../config/constants';
import axios from 'axios';
import config from '../config';
import * as jwt from 'jsonwebtoken';
import { UpdateUserInoReq, UserListReq, UserDto } from './users.dto';
import { UserInfo } from './users.interface';
import roles from './roles';
import { Cnarea } from 'entity/cnarea';
import * as bluebird from 'bluebird';
import { Company } from 'entity/company';

@Injectable()
export class UsersService {
  private readonly jwtSecret: string;
  private allArea: Cnarea[];
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Cnarea)
    private readonly cnareaRepository: Repository<Cnarea>,
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
  ) {
    this.jwtSecret = config.get('JWT_SECRET');
    this.loadArea();
  }

  async loadArea() {
    let allArea = await this.cnareaRepository.find({
      select: ['id', 'parent_id', 'name'],
    });
    this.allArea = allArea;
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

  async registor(username: string, password: string, role: string) {
    let _user = await this.userRepository.findOne({ username });
    if (_user) {
      throw new ForbiddenException('用户已存在');
    }
    let user = new User();
    user.username = username;
    user.password = password;
    user.role = role || 'user';
    await user.save();
  }

  async update(userDto: UserDto) {
    let user = new User();
    user.id = userDto.id;
    user.username = userDto.username;
    user.nickname = userDto.nickname;
    user.role = userDto.role;
    await user.save();
    return this.userRepository.findOne({ id: userDto.id });
  }

  async delete(id: number) {
    let user = new User();
    user.id = id;
    await user.remove();
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

  async getRoles(role: string) {
    let start = roles.findIndex(i => i.key === role);
    if (start > 0) {
      start++;
    }
    let end = start < 6 ? 6 : roles.length;
    return roles.slice(start, end);
  }

  findArea(parent_id?: number) {
    return this.allArea.filter(item => item.parent_id === parent_id);
  }

  async getArea(userId: number) {
    let user = await this.userRepository.findOne({ id: userId });
    if (user.role === 'districtadmin') {
      return this.companyRepository.find({ areaId: user.areaId });
    }
    if (!this.allArea) {
      await this.loadArea();
    }
    return this.getAreaItems(user.areaId);
  }

  getAreaItems(parent_id: number) {
    let area = this.findArea(parent_id);
    for (let item of area) {
      item.items = this.getAreaItems(item.id);
    }
    return area;
  }
}
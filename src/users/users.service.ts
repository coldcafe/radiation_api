import { Injectable, ForbiddenException } from '@nestjs/common';
import { User } from '../entity/user';
import { Repository, MoreThan, In } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CONST } from '../config/constants';
import axios from 'axios';
import config from '../config';
import * as jwt from 'jsonwebtoken';
import { UpdateUserInoReq, UserListReq, UserDto } from './users.dto';
import { UserInfo } from './users.interface';
import roles from './roles';
import { Cnarea } from '../entity/cnarea';
import * as bluebird from 'bluebird';
import { Company } from '../entity/company';

@Injectable()
export class UsersService {
  private readonly jwtSecret: string;
  private allArea: Cnarea[];
  private allCompany: Company[];
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
    this.allArea = await this.cnareaRepository.find({
      select: ['id', 'parent_id', 'name', 'level'],
    });
  }

  async loadCompany() {
    this.allCompany = await this.companyRepository.find({
      select: ['id', 'areaId', 'name'],
    });
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

  async registor(username: string, password: string, role: string,
                 areaId: number, companyId: number, companyName: string, companyAreaId: number) {
    let _user = await this.userRepository.findOne({ username });
    if (_user) {
      throw new ForbiddenException('用户已存在');
    }
    let user = new User();
    user.username = username;
    user.nickname = username;
    user.password = password;
    user.role = role;
    if (areaId) {
      user.areaId = areaId;
    }
    if (companyId) {
      let company = await this.companyRepository.findOne({ id: companyId });
      user.companyId = companyId;
      user.areaId = company.areaId;
    } else if (companyName) {
      let company = await this.companyRepository.findOne({ name: companyName });
      if (!company && companyAreaId) {
        let area = await this.cnareaRepository.findOne({ id: companyAreaId });
        if (area.level !== 2) {
          throw new Error('非区级地点');
        }
        company =  await this.companyRepository.create({ areaId: companyAreaId, name: companyName });
      }
      user.companyId = company.id;
      user.areaId = company.areaId;
    }
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

  getAreaIds(areas, areaIds) {
    for (let area of areas) {
      areaIds.push(area.id);
      if (area.items && area.items.length) {
        this.getAreaIds(area.items, areaIds);
      }
    }
  }

  async userQuery(userListReq: UserListReq, userId: number) {
    let { username, nickname, page, limit } = userListReq;
    let where = {};
    if (nickname) {
      where['nickname'] = nickname;
    }
    if (username) {
      where['username'] = username;
    }
    let user = await this.userRepository.findOne({ id: userId });
    if (!this.allArea) {
      await this.loadArea();
    }
    if (user.areaId) {
      let areas = this.getAreaItems(user.areaId, 2);
      let areaIds = [];
      this.getAreaIds(areas, areaIds);
      where['areaId'] = In(areaIds);
    }
    return { where, page, limit };
  }

  async userList(where, page, limit) {
    let users = await this.userRepository.find({
      where,
      take: limit,
      skip: (page - 1) * limit,
    });
    await this.loadCompany();
    for (let user of users) {
      if (user.areaId) {
        let area = this.allArea.find(i => i.id === user.areaId);
        user['areaName'] = area ? area.name : '';
      }
      if (user.companyId) {
        let company = this.allCompany.find(i => i.id === user.companyId);
        user['companyName'] = company ? company.name : '';
      }
    }
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
    start++;
    let end = start < 6 ? 6 : roles.length;
    return roles.slice(start, end);
  }

  findArea(parent_id?: number) {
    return this.allArea.filter(item => item.parent_id === parent_id);
  }

  findCompany(areaId?: number) {
    let company = this.allCompany.filter(item => item.areaId === areaId);
    return [{ id: 999999, name: '新建企业' }, ...company];
  }

  async getArea(userId: number, tRole: string) {
    let user = await this.userRepository.findOne({ id: userId });
    if (user.role === 'companyadmin') {
      return [];
    }
    if (user.role === 'districtadmin') {
      let company = await this.companyRepository.find({ areaId: user.areaId });
      return [{ id: 999999, name: '新建企业' }, ...company];
    }
    if (!this.allArea) {
      await this.loadArea();
    }
    await this.loadCompany();
    let roleIndex = roles.findIndex(i => i.key === tRole);
    let tolevel = roleIndex - 2 >= 0 ? roleIndex - 2 : -1;
    return this.getAreaItems(user.areaId, tolevel);
  }

  getAreaItems(parent_id: number, tolevel: number) {
    if (tolevel < 0) {
      return [];
    }
    let area = this.findArea(parent_id);
    for (let item of area) {
      if (item.level >= tolevel) {
        item.items = [];
        continue;
      }
      if (item.level === 2) {
        item.items = this.findCompany(item.id);
      } else {
        item.items = this.getAreaItems(item.id, tolevel);
      }
    }
    return area;
  }
}
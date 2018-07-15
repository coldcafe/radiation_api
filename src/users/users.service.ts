import { Injectable } from '@nestjs/common';
import { User } from '../entity/user';
import { WechatUser } from '../entity/wechatUser';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CONST } from '../config/constants';
import { ConfigService } from '../config/config.service';
import axios from 'axios';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(WechatUser)
    private readonly wechatUserRepository: Repository<WechatUser>,
    private readonly config: ConfigService,
  ) {}

  async create(userDto) {
    const user = new User();
    user.name = userDto.name;
    user.age = userDto.age;
    user.mobile = userDto.mobile;
    user.type = CONST.USER_TYPE.STUDENT;
    await this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async wxLogin(code: string): Promise<any> {
    const wxLoginInfo = await axios({
      baseURL: this.config.get('WX_API'),
      method: 'GET',
      url: '/sns/jscode2session',
      params: {
        appid: this.config.get('WX_LITE_APPID'),
        secret: this.config.get('WX_LITE_APPSECRET'),
        grant_type: 'authorization_code',
        js_code: code,
      },
    });
    if (wxLoginInfo.data.errcode) {
        throw new Error(wxLoginInfo.data.errmsg);
    }
    const sessionKey = wxLoginInfo.data.session_key;
    const openid = wxLoginInfo.data.openid;
    const unionid = wxLoginInfo.data.unionid;
    return { sessionKey, openid, unionid };
    // let wechatUser = await this.wechatUserRepository.findOne({ openid }, { relations: ['user'] });
    // if (!wechatUser) {
    //   wechatUser = new WechatUser();
    //   wechatUser.openid = openid;
    //   wechatUser.unionid = unionid;
    //   wechatUser.sessionKey = sessionKey;
    // }
    // if (!wechatUser.user) {
    //   let user = new User();
    //   wechatUser.user = user;
    // }
    // await this.wechatUserRepository.save(wechatUser);
    // console.log(wechatUser.user.id);
    // let payload = {
    //     avatar: userInfo.data.headimgurl,
    //     name: userInfo.data.nickname,
    // };
  }
}
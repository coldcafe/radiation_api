import { Get, Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { Injectable, Inject } from '@nestjs/common';
import * as qiniu from 'qiniu';
import config from './config';

@Controller()
export class AppController {
  private readonly qiniuMac: qiniu.auth.digest.Mac;
  constructor(
    private readonly appService: AppService,
  ) {
    let accessKey = config.get('QINIU_ACCESS_KEY');
    let secretKey = config.get('QINIU_SECRET_KEY');
    this.qiniuMac = new qiniu.auth.digest.Mac(accessKey, secretKey);
  }

  @Get()
  root(): string {
    return this.appService.root();
  }

  @Get('/qiniu')
  async qiniu() {

  }
}

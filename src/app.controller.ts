import { Get, Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { Injectable, Inject } from '@nestjs/common';
import * as qiniu from 'qiniu';
import * as memoryCache from 'memory-cache';
import config from './config';
import { QiniuService } from './qiniu.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly qiniuService: QiniuService,
  ) { }

  @Get()
  root(): string {
    return this.appService.root();
  }

  @Get('/qiniu')
  async qiniu() {
    let token = this.qiniuService.getToken();
    return { token };
  }
}

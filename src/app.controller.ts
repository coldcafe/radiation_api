import { Get, Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { Injectable, Inject } from '@nestjs/common';
import * as qiniu from 'qiniu';
import * as memoryCache from 'memory-cache';
import config from './config';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
  ) { }

  @Get()
  root(): string {
    return this.appService.root();
  }

}

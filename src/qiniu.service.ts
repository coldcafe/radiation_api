import { Injectable } from '@nestjs/common';
import * as memoryCache from 'memory-cache';
import * as qiniu from 'qiniu';
import config from './config';

@Injectable()
export class QiniuService {
  private readonly qiniuMac: qiniu.auth.digest.Mac;
  private readonly qiniuOptions = {
    scope: 'housedecoration',
    expires: 7200,
  };
  constructor() {
    let accessKey = config.get('QINIU_ACCESS_KEY');
    let secretKey = config.get('QINIU_SECRET_KEY');
    this.qiniuMac = new qiniu.auth.digest.Mac(accessKey, secretKey);
    this.setToken();
  }
  setToken() {
    let putPolicy = new qiniu.rs.PutPolicy(this.qiniuOptions);
    let uploadToken = putPolicy.uploadToken(this.qiniuMac);
    memoryCache.put('qiniuUploadToken', uploadToken, 7000 * 1000, () => {
      this.setToken();
    });
  }
  getToken() {
    return memoryCache.get('qiniuUploadToken');
  }
}
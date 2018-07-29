import { createParamDecorator } from '@nestjs/common';

// 获取ip
export const IP = createParamDecorator((key, req) => {
  let ip = req.headers['x-forwarded-for'] || // 判断是否有反向代理 IP
  req.connection.remoteAddress || // 判断 connection 的远程 IP
  req.socket.remoteAddress; // 判断后端的 socket 的 IP
  ip = ip.match(/\d+.\d+.\d+.\d+/);
  if (ip) {
      return ip[0];
  }else {
      return '127.0.0.1';
  }
});
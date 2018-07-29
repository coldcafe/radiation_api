import { createParamDecorator } from '@nestjs/common';

export const UserInfo = createParamDecorator((key, req) => {
  if (key){
      return req.user && req.user[key];
  }else{
      return req.user;
  }
});
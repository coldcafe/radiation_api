import { ApiModelProperty } from '@nestjs/swagger';

export class LoginReq {
  @ApiModelProperty()
  readonly code: string;
}
export class LoginRes {
  @ApiModelProperty({ description: '登录态：jwt token, 携带数据： { userId, openId, unionId }' })
  readonly token: string;
}

export class RegisterReq {
  @ApiModelProperty({ description: '登录态：jwt token, 携带数据： { openId, name, avatar, age, mobile, sex, type}' })
  readonly code: string;
}

export class RegisterRes {
  @ApiModelProperty({ description: '登录态：jwt token, 携带数据： { userId, openId, unionId }' })
  readonly token: string;
}
import { ApiModelProperty } from '@nestjs/swagger';

export class LoginReq {
  @ApiModelProperty()
  readonly username: string;
  @ApiModelProperty()
  readonly password: string;
}
export class LoginRes {
  @ApiModelProperty({ description: '登录态：jwt token, 携带数据： { id, username, role }' })
  readonly token: string;
}

export class RegisterReq {
  @ApiModelProperty()
  readonly username: string;
  @ApiModelProperty()
  readonly password: string;
}

export class UpdateUserInoReq {
  @ApiModelProperty()
  readonly id: number;
  @ApiModelProperty({ required: false })
  readonly password?: string;
  @ApiModelProperty({ required: false })
  readonly nickname?: string;
}

export class UserListReq {
  @ApiModelProperty()
  readonly page: number = 1;
  @ApiModelProperty()
  readonly limit: number = 10;
  @ApiModelProperty({ required: false })
  readonly username?: string;
  @ApiModelProperty({ required: false })
  readonly nickname?: string;
}
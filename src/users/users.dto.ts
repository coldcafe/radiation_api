import { ApiModelProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class LoginReq {
  @ApiModelProperty()
  readonly username: string;
  @ApiModelProperty()
  readonly password: string;
}
export class LoginRes {
  @ApiModelProperty({ description: '登录态：jwt token, 携带数据： { id, username, role }' })
  token: string;
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
  @Type(() => Number)
  readonly page: number = 1;

  @ApiModelProperty()
  @Type(() => Number)
  readonly limit: number = 10;

  @ApiModelProperty({ required: false })
  @Type(() => String)
  readonly username?: string;

  @ApiModelProperty({ required: false })
  @Type(() => String)
  readonly nickname?: string;
}

export class UserDto {

  @ApiModelProperty()
  id: number;

  @ApiModelProperty()
  username: string;

  @ApiModelProperty()
  nickname: string;

  @ApiModelProperty()
  role: string;

  @ApiModelProperty()
  createdAt: Date;

}
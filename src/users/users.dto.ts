import { ApiModelProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, IsInt, IsOptional } from 'class-validator';

export class LoginReq {

  @IsString()
  @ApiModelProperty()
  readonly username: string;

  @IsString()
  @ApiModelProperty()
  readonly password: string;

}
export class LoginRes {
  @ApiModelProperty({ description: '登录态：jwt token, 携带数据： { id, username, role }' })
  token: string;
}

export class RegisterReq {

  @IsString()
  @ApiModelProperty()
  readonly username: string;

  @IsString()
  @ApiModelProperty()
  readonly password: string;

}

export class UpdateUserInoReq {

  @IsInt()
  @ApiModelProperty()
  readonly id: number;

  @IsString()
  @IsOptional()
  @ApiModelProperty({ required: false })
  readonly password?: string;

  @IsString()
  @IsOptional()
  @ApiModelProperty({ required: false })
  readonly nickname?: string;
}

export class UserListReq {

  @ApiModelProperty({ required: false })
  @Type(() => Number)
  readonly page: number = 1;

  @ApiModelProperty({ required: false })
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

export class UserListDto {

  @ApiModelProperty({ type: UserDto, isArray: true })
  users: UserDto[];

  @ApiModelProperty()
  count: number;

}
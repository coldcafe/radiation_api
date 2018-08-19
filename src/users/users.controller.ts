import { Controller, Get, Post, Body, Put, Param, Delete, HttpCode, Req, Request, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '../entity/user';
import { ApiUseTags, ApiResponse } from '@nestjs/swagger';
import { LoginReq, LoginRes, RegisterReq, UpdateUserInoReq, UserListReq, UserDto, UserListDto } from './users.dto';
import { Roles } from '../grards/roles.grards';
@ApiUseTags('users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
  ) { }

  @Post('/login')
  @HttpCode(200)
  @ApiResponse({ status: 200, type: LoginRes })
  async login(@Body() loginReq: LoginReq) {
    const token = await this.usersService.login(loginReq.username, loginReq.password);
    return { token };
  }

  @Post('/registor')
  @HttpCode(204)
  @ApiResponse({ status: 204 })
  async registor(@Body() registerReq: RegisterReq) {
    await this.usersService.registor(registerReq.username, registerReq.password);
  }

  // @Roles('superadmin')
  @Get('/list')
  @ApiResponse({ status: 200, type: UserListDto })
  async userList(@Query() userListReq: UserListReq) {
    let { where, page, limit } = await this.usersService.userQuery(userListReq);
    let users = await this.usersService.userList(where, page, limit);
    let count = await this.usersService.userCount(where);
    let usersDto = users.map(((user) => {
      let userDto = new UserDto();
      userDto.id = user.id;
      userDto.username = user.username;
      userDto.nickname = user.nickname;
      userDto.role = user.role;
      userDto.createdAt = user.createdAt;
      return userDto;
    }));
    return { users: usersDto, count };
  }

  // @Roles('superadmin')
  @Put('/password')
  @HttpCode(204)
  @ApiResponse({ status: 204 })
  async changePassword(@Body() updateUserInoReq: UpdateUserInoReq) {
    await this.usersService.updateUserInfo(updateUserInoReq);
  }
}
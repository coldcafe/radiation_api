import { Controller, Get, Post, Body, Put, Param, Delete, HttpCode, Req, Request, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '../entity/user';
import { ApiUseTags, ApiResponse } from '@nestjs/swagger';
import { LoginReq, LoginRes, RegisterReq, UpdateUserInoReq, UserListReq } from './users.dto';
import { Roles } from '../grards/roles.grards';
@ApiUseTags('users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
  ) {}

  @Post('/login')
  @HttpCode(200)
  @ApiResponse({ status: 200, type: LoginRes })
  async login(@Body() loginReq: LoginReq) {
    const token = await this.usersService.login(loginReq.username, loginReq.password);
    return token;
  }

  @Post('/registor')
  @HttpCode(204)
  @ApiResponse({ status: 204 })
  async registor(@Body() registerReq: RegisterReq) {
    await this.usersService.registor(registerReq.username, registerReq.password);
  }

  @Roles('admin')
  @Get('/list')
  @ApiResponse({ status: 200, type: UserListReq })
  async userInfo(@Query() userListReq: UserListReq) {
    console.log(userListReq);
    let users = await this.usersService.userList(userListReq);
    return users;
  }

  @Roles('admin')
  @Put('/password')
  @HttpCode(204)
  @ApiResponse({ status: 204 })
  async changePassword(@Body() updateUserInoReq: UpdateUserInoReq) {
    await this.usersService.updateUserInfo(updateUserInoReq);
  }
}
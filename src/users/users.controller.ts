import { Controller, Get, Post, Body, Put, Param, Delete, HttpCode, Req, Request, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '../entity/user';
import { ApiUseTags, ApiResponse } from '@nestjs/swagger';
import { LoginReq, LoginRes, RegisterReq, UpdateUserInoReq, UserListReq, UserDto, UserListDto } from './users.dto';
import { Roles } from '../grards/roles.grards';
import { UserInfo } from '../decorators/userinfo';
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
  @Roles()
  @ApiResponse({ status: 204 })
  async registor(@UserInfo() user, @Body() registerReq: RegisterReq) {
    let { username, password, role, areaId, companyId, companyName, companyAreaId } = registerReq;
    if (user.role === 'companyadmin') {
      companyId = user.companyId;
    }
    await this.usersService.registor(username, password, role, areaId, companyId, companyName, companyAreaId);
  }

  @Put()
  @HttpCode(200)
  @ApiResponse({ status: 200, type: UserDto })
  async updateUser(@Body() UserDto: UserDto) {
    let user = await this.usersService.update(UserDto);
    return user;
  }

  @Delete('/:id')
  @HttpCode(200)
  @ApiResponse({ status: 200, type: UserDto })
  async deleteUser(@Param('id') id) {
    await this.usersService.delete(parseInt(id, 10));
  }

  @Get('/list')
  @Roles()
  @ApiResponse({ status: 200, type: UserListDto })
  async userList(@UserInfo('id') userId: number, @Query() userListReq: UserListReq) {
    let { where, page, limit } = await this.usersService.userQuery(userListReq, userId);
    let users = await this.usersService.userList(where, page, limit);
    let count = await this.usersService.userCount(where);
    let usersDto = users.map(((user) => {
      let userDto = new UserDto();
      userDto.id = user.id;
      userDto.username = user.username;
      userDto.nickname = user.nickname;
      userDto.role = user.role;
      userDto.areaName = user['areaName'];
      userDto.companyName = user['companyName'];
      userDto.createdAt = user.createdAt;
      return userDto;
    }));
    return { users: usersDto, count };
  }

  @Roles()
  @Put('/password')
  @HttpCode(204)
  @ApiResponse({ status: 204 })
  async changePassword(@Body() updateUserInoReq: UpdateUserInoReq) {
    await this.usersService.updateUserInfo(updateUserInoReq);
  }

  @Roles()
  @Get('/roles')
  @HttpCode(200)
  @ApiResponse({ status: 200 })
  async getRoles(@UserInfo('role') role: string) {
    return this.usersService.getRoles(role);
  }

  @Roles()
  @Get('/area')
  @HttpCode(200)
  @ApiResponse({ status: 200 })
  async getArea(@UserInfo('id') userId: number, @Query() query) {
    return this.usersService.getArea(userId, query.tRole);
  }
}
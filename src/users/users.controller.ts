import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '../entity/user';
import { ApiUseTags, ApiResponse } from '@nestjs/swagger';
import { LoginReq, LoginRes, RegisterReq, RegisterRes } from './users.dto';
@ApiUseTags('users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
  ) {}
  @Post()
  @ApiResponse({ status: 201, description: 'This action adds a new user'})
  async create(@Body() userDto) {
    await this.usersService.create(userDto);
    return 'This action adds a new user';
  }

  @Get()
  @ApiResponse({ status: 200, isArray: true})
  async findAll(): Promise<User[]> {
    const result: User[] = await this.usersService.findAll();
    return result;
  }
  @Post('/wx_login')
  @ApiResponse({ status: 200, type: LoginRes })
  async wxLogin(@Body() loginReq: LoginReq) {
    const token = await this.usersService.wxLogin(loginReq.code);
    return token;
  }
  @Post('/register')
  @ApiResponse({ status: 200, type: RegisterRes })
  async register(@Body() registerReq: RegisterReq) {
    const token: string = await this.usersService.wxLogin(registerReq.code);
    return { token };
  }
}
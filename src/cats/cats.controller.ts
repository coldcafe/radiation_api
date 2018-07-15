import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { CatsService } from './cats.service';
import { Cat } from '../entity/cat';
import { CatDto } from './cat.dto';
import { ApiUseTags, ApiResponse } from '@nestjs/swagger';
@ApiUseTags('cats')
@Controller('cats')
export class CatsController {
  constructor(
    private readonly catsService: CatsService,
  ) {}
  @Post()
  @ApiResponse({ status: 200, description: 'This action adds a new cat'})
  async create(@Body() catDto: CatDto) {
    await this.catsService.create(catDto);
    return 'This action adds a new cat';
  }

  @Get()
  @ApiResponse({ status: 200, type: CatDto, isArray: true})
  async findAll(): Promise<Cat[]> {
    const result: Cat[] = await this.catsService.findAll();
    return result;
  }

  @Get(':id')
  findOne(@Param('id') id) {
    return `This action returns a #${id} cat`;
  }

  @Put(':id')
  update(@Param('id') id, @Body() updateCatDto) {
    return `This action updates a #${id} cat`;
  }

  @Delete(':id')
  remove(@Param('id') id) {
    return `This action removes a #${id} cat`;
  }
}
import { Controller, Get, Post, Body, Put, Param, Delete, HttpCode, Req, Request, Query } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { User } from '../entity/user';
import { ApiUseTags, ApiResponse } from '@nestjs/swagger';
import { ReportDto } from './reports.dto';
import { Roles } from '../grards/roles.grards';
@ApiUseTags('reports')
@Controller('reports')
export class ReportsController {
  constructor(
    private readonly reportsService: ReportsService,
  ) {}

  @Post('/upload')
  @ApiResponse({ status: 201 })
  async uploadReport(@Body() reportDto: ReportDto) {

  }
}
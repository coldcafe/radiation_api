import { Controller, Get, Post, Body, Put, Param, Delete, HttpCode, Req, Request, Query } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { User } from '../entity/user';
import { ApiUseTags, ApiResponse } from '@nestjs/swagger';
import { ReportDto, ReportListReq, ReportDataDto } from './reports.dto';
import { Roles } from '../grards/roles.grards';
@ApiUseTags('reports')
@Controller('reports')
export class ReportsController {
  constructor(
    private readonly reportsService: ReportsService,
  ) {}

  @Post('/upload')
  @Roles()
  @ApiResponse({ status: 201 })
  async uploadReport(@Body() reportDto: ReportDto) {
    await this.reportsService.createReport(reportDto);
  }

  @Get('/list')
  @ApiResponse({ status: 200, type: ReportDto, isArray: true })
  async reportList(@Query() query: ReportListReq) {
    let reports = await this.reportsService.reportList(query.page, query.limit);
    return reports.map((report) => {
      let reportDto = new ReportDto();
      reportDto.measurePerson = report.measurePerson;
      reportDto.machineNO = report.machineNO;
      reportDto.taskNO = report.taskNO;
      reportDto.measuredAt = report.measuredAt;
      reportDto.type = report.type;
      reportDto.weather = report.weather;
      reportDto.address = report.address;
      reportDto.unit = report.unit;
      reportDto.contactPerson = report.contactPerson;
      reportDto.contactPersonTel = report.contactPersonTel;
      reportDto.GPS = report.GPS;
      reportDto.pictures = JSON.parse(report.pictures);
      reportDto.data = report.data.map((item) => {
        let reportDataDto = new ReportDataDto();
        reportDataDto.measurePoint = item.measurePoint;
        reportDataDto.K = item.K;
        reportDataDto.values = item.values;
        return reportDataDto;
      });
      return reportDto;
    });
  }
}
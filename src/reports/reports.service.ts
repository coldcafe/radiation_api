import { Injectable, ForbiddenException } from '@nestjs/common';
import { User } from '../entity/user';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CONST } from '../config/constants';
import { ConfigService } from '../config/config.service';
import axios from 'axios';
import * as jwt from 'jsonwebtoken';
import { Report } from '../entity/report';
import { ReportData } from '../entity/report_data';
import { ReportDto } from './reports.dto';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Report)
    private readonly reportRepository: Repository<Report>,
    @InjectRepository(ReportData)
    private readonly reportDataRepository: Repository<ReportData>,
  ) {}

  async createReport(reportDto: ReportDto) {
    let report = new Report();
    report.measurePerson = reportDto.measurePerson;
    report.machineNO = reportDto.machineNO;
    report.taskNO = reportDto.taskNO;
    report.measuredAt = reportDto.measuredAt;
    report.type = reportDto.type;
    report.weather = reportDto.weather;
    report.address = reportDto.address;
    report.unit = reportDto.unit;
    report.contactPerson = reportDto.contactPerson;
    report.contactPersonTel = reportDto.contactPersonTel;
    report.GPS = reportDto.GPS;
    report.pictures = JSON.stringify(reportDto.pictures);
    report.data = reportDto.data.map((item) => {
      let reportData = new ReportData();
      reportData.measurePoint = item.measurePoint;
      reportData.K = item.K;
      reportData.values = item.values;
      return reportData;
    });
    await report.save();
  }

  async reportList(page: number, limit: number) {
    let reports = await this.reportRepository.find({
      take: limit,
      skip: (page - 1) * limit,
      relations: ['data'],
    });
    return reports;
  }

}
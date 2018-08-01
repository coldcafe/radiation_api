import { Injectable, ForbiddenException } from '@nestjs/common';
import { User } from '../entity/user';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Like } from 'typeorm';
import { CONST } from '../config/constants';
import config from '../config';
import axios from 'axios';
import * as jwt from 'jsonwebtoken';
import { Report } from '../entity/report';
import { ReportData } from '../entity/report_data';
import { ReportDto, ReportListReq } from './reports.dto';
import { UserInfo } from '../users/users.interface';

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

  async createReport(userId: number, reportDto: ReportDto) {
    let report = new Report();
    let user = new User();
    user.id = userId;
    report.user = user;
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

  reportQuery(userInfo: UserInfo, query: ReportListReq) {
    let { startTime, endTime, address, username, page, limit } = query;
    let where = {};
    if (startTime) {
      where['createdAt'] = { $gt: new Date(startTime * 1000) };
    }
    if (startTime && endTime) {
      where['createdAt']['$lt'] = new Date(endTime * 1000);
    }
    if (address) {
      where['address'] = Like(`%${address}%`);
    }
    if (username) {
      where['username'] = username;
    }
    if (userInfo.role !== 'superadmin') {
      where['user'] = userInfo.id;
    }
    return { where, page, limit };
  }

  async reportList(where, page, limit) {
    let reports = await this.reportRepository.find({
      where,
      take: limit,
      skip: (page - 1) * limit,
      relations: ['data'],
      order: { id: -1 },
    });
    return reports;
  }

  async reportCount(where) {
    let count = await this.reportRepository.count({
      where,
    });
    return count;
  }

}
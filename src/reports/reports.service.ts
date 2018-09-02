import { Injectable, ForbiddenException } from '@nestjs/common';
import { User } from '../entity/user';
import { Repository, MoreThan, Between } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Like } from 'typeorm';
import { Report } from '../entity/report';
import { ReportData } from '../entity/report_data';
import { ReportDto, ReportListReq } from './reports.dto';
import { UserInfo } from '../users/users.interface';
import { SketchMap } from '../entity/sketch_map';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Report)
    private readonly reportRepository: Repository<Report>,
    @InjectRepository(ReportData)
    private readonly reportDataRepository: Repository<ReportData>,
    @InjectRepository(SketchMap)
    private readonly sketchMapRepository: Repository<SketchMap>,
  ) { }

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
    report.sketchMap = reportDto.sketchMap;
    report.pictures = reportDto.pictures ? JSON.stringify(reportDto.pictures) : '';
    report.data = reportDto.data ? reportDto.data.map((item) => {
      let reportData = new ReportData();
      reportData.measurePoint = item.measurePoint;
      reportData.K = item.K;
      reportData.values = item.values;
      return reportData;
    }) : [];
    await report.save();
    return report;
  }

  reportQuery(userInfo: UserInfo, query: ReportListReq) {
    let { startTime, endTime, address, measurePerson, page, limit } = query;
    let where = {};
    if (startTime) {
      where['createdAt'] = MoreThan(new Date(startTime * 1000));
    }
    if (startTime && endTime) {
      where['createdAt'] = Between(new Date(startTime * 1000), new Date(endTime * 1000));
    }
    if (address) {
      where['address'] = Like(`%${address}%`);
    }
    if (measurePerson) {
      where['measurePerson'] = measurePerson;
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

  async updateReport(reportDto: ReportDto) {
    let report = new Report();
    report.id = reportDto.id;
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
    report.sketchMap = reportDto.sketchMap;
    report.pictures = reportDto.pictures ? JSON.stringify(reportDto.pictures) : '';
    report.data = reportDto.data ? reportDto.data.map((item) => {
      let reportData = new ReportData();
      reportData.id = item.id;
      reportData.measurePoint = item.measurePoint;
      reportData.K = item.K;
      reportData.values = item.values;
      return reportData;
    }) : [];
    await report.save();
    return report;
  }

  async sketchMapList() {
    let result = await this.sketchMapRepository.find();
    return result;
  }

  async addSketchMap(pic: string) {
    let sketchMap = new SketchMap();
    sketchMap.pic = pic;
    await sketchMap.save();
  }

  async removeSketchMap(id: number) {
    let sketchMap = new SketchMap();
    sketchMap.id = id;
    await sketchMap.remove();
  }

}
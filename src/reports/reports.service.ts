import { Response } from 'express';
import * as officegen from 'officegen';
import * as _ from 'lodash';
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
    report.result = reportDto.result;
    if (report.data) {
      report.data = reportDto.data.map((item) => {
        let reportData = new ReportData();
        reportData.measurePoint = item.measurePoint;
        reportData.K = item.K;
        reportData.values = item.values;
        return reportData;
      });
    }
    await report.save();
    return report;
  }

  async reportExport(id: number) {
    try {
      let report = await this.reportRepository.findOne({
        where: { id },
        relations: ['data'],
      });
      let docx = officegen('docx');

      docx.on('error', (err) => {
        console.log(err);
      });

      let table: any = [
        [{ val: '项目名称' }, { val: 'xxx', opts: { gridSpan: 5 } }],
        [{ val: '测量地址' }, { val: report.address, opts: { gridSpan: 5 } }],
        [{ val: '联系人' }, { val: report.contactPerson, opts: { gridSpan: 2 } }, { val: '联系人' }, { val: report.contactPerson, opts: { gridSpan: 2 } }],
        [{ val: '天气状况' }, { val: report.weather, opts: { gridSpan: 2 } }, { val: '天气状况' }, { val: report.weather, opts: { gridSpan: 2 } }],
        [{ val: '检测类别' }, { val: report.type, opts: { gridSpan: 2 } }, { val: '检测单位' }, { val: report.unit, opts: { gridSpan: 2 } }],
        [{ val: '监测标准' }, { val: 'XXX', opts: { gridSpan: 2 } }, { val: '监测仪器' }, { val: report.machineNO, opts: { gridSpan: 2 } }],
        [{ val: '监测项目' }, { val: 'XXX', opts: { gridSpan: 5 } }],
        [{ val: '监   测   结   果', opts: { gridSpan: 6 } }],
        ['监测点编号', '监测点位', '测点数', '测值范围', '平均值', '测量结果'],
      ];
      if (report.data && report.data.length > 0) {
        report.data.forEach((item, index) => {
          let values: string[] = item.values.split(',');
          let average = values[10];
          let result = values[12];
          values = values.slice(0, 9);
          let vals = values.map((value) => {
            let reg = /\d+\.?\d*/;
            let val = reg.exec(value);
            return val ? parseInt(val.toString(), 10) : 0;
          });
          table.push([index, item.measurePoint, 10, _.min(vals) + '---' + _.max(vals), average, result]);
        });
      }
      let tableStyle = {
        tableColWidth: 4261,
        tableAlign: 'center',
        borders: true,
      };
      docx.createTable(table, tableStyle);
      return docx;
    } catch (error) {
      console.error(error);
    }

  }

  reportQuery(userInfo: UserInfo, query: ReportListReq) {
    let { startTime, endTime, address, measurePerson, page, limit } = query;
    let where = {};
    if (startTime) {
      where['measuredAt'] = MoreThan(startTime);
    }
    if (startTime && endTime) {
      where['measuredAt'] = Between(startTime, endTime);
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
    report.result = reportDto.result;
    report.pictures = reportDto.pictures ? JSON.stringify(reportDto.pictures) : '';
    if (reportDto.data) {
      report.data = reportDto.data.map((item) => {
        let reportData = new ReportData();
        reportData.id = item.id;
        reportData.measurePoint = item.measurePoint;
        reportData.K = item.K;
        reportData.values = item.values;
        return reportData;
      });
    }
    await report.save();
    return this.reportRepository.findOne({ where: { id: reportDto.id }, relations: ['data'] });
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
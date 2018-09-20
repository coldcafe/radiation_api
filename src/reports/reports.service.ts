import * as _ from 'lodash';
import { Injectable, ForbiddenException } from '@nestjs/common';
import { User } from '../entity/user';
import { Repository, MoreThan, Between } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Like } from 'typeorm';
import { Report } from '../entity/report';
import { ReportData } from '../entity/report_data';
import { ReportDto, ReportListReq, DocTempDto } from './reports.dto';
import { UserInfo } from '../users/users.interface';
import { SketchMap } from '../entity/sketch_map';
import * as moment from 'moment';
import * as fs from 'fs';
import * as path from 'path';
import * as JSZip from 'jszip';
import * as Docxtemplater from 'docxtemplater';
import * as ImageModule from 'docxtemplater-image-module';
import { DocTemp } from '../entity/doc_temp';

// Load the docx file as a binary
let tempbin = fs.readFileSync(path.resolve(__dirname, '../../', 'temp.docx'), 'binary');

let imageModule = new ImageModule({
  centered: false,
  getImage: (tagValue, tagName) => {
    return fs.readFileSync(tagValue);
  },
  getSize: (img, tagValue, tagName) => {
    return [500, 500];
  },
});

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
    @InjectRepository(DocTemp)
    private readonly docTempRepository: Repository<DocTemp>,
  ) { }

  async createReport(userId: number, reportDto: ReportDto) {
    let report = new Report();
    let user = new User();
    user.id = userId;
    report.user = user;
    report.name = reportDto.name;
    report.delegateUnit = reportDto.delegateUnit;
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
    report.docTempId = reportDto.docTempId;
    report.pictures = reportDto.pictures ? JSON.stringify(reportDto.pictures) : '';
    report.result = reportDto.result;
    if (reportDto.data) {
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

  async removeReport(id: number) {
    let report = await this.reportRepository.findOne({
      where: { id },
      relations: ['data'],
    });
    if (!report) return;
    for (let item of report.data) {
      await item.remove();
    }
    await report.remove();
  }

  async reportExport(id: number) {

    let report = await this.reportRepository.findOne({
      where: { id },
      relations: ['data'],
    });

    if (!report.docTempId) {
      throw new Error('no docTempId');
    }
    let docTemp = await this.docTempRepository.findOne({ id: report.docTempId });
    if (!docTemp) {
      throw new Error('no docTemp');
    }
    try {
      let doc = new Docxtemplater();
      doc.attachModule(imageModule);
      doc.loadZip(new JSZip(tempbin));

      // set the templateVariables
      let data = {
        main_title: docTemp.title,
        main_address: docTemp.address,
        main_tel: docTemp.tel,
        main_facsimile: docTemp.facsimile,
        main_email: docTemp.email,
        date: moment().format('YYYY年 MM月 DD日'),
        name: report.name,
        taskNO: report.taskNO,
        delegateUnit: report.delegateUnit,
        address: report.address,
        contactPerson: report.contactPerson,
        contactPersonTel: report.contactPersonTel,
        weather: report.weather,
        measurePerson: report.measurePerson,
        checkPerson: '',
        measuredAt: moment(new Date(report.measuredAt * 1000)).format('YYYY年 MM月 DD日'),
        type: report.type,
        unit: report.unit,
        machineNO: report.machineNO,
        remark: '',
        result: report.result,
        data: report.data.map((item, index) => {
          let values: string[] = item.values.split(',');
          let average = values[10];
          let result = values[12];
          values = values.slice(0, 9);
          let vals = values.map((value) => {
            let reg = /\d+\.?\d*/;
            let val = reg.exec(value);
            return val ? parseInt(val.toString(), 10) : 0;
          });
          return {
            No: index,
            measurePoint: item.measurePoint,
            n: 10,
            min: _.min(vals),
            max: _.max(vals),
            average,
            result,
          };
        }),
        sketchMap: path.join(__dirname, '../../file_store/public/files', report.sketchMap),
      };
      doc.setData(data);
      doc.render();
      let buf = doc.getZip().generate({ type: 'nodebuffer' });
      return buf;
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
    if (reportDto.id) {
      new Error('no id');
    }
    let report = new Report();
    report.id = reportDto.id;
    report.name = reportDto.name;
    report.delegateUnit = reportDto.delegateUnit;
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
    report.docTempId = reportDto.docTempId;
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

  async docTempList() {
    let result = await this.docTempRepository.find();
    return result;
  }

  async addDocTemp(docTempDto: DocTempDto) {
    let docTemp = new DocTemp();
    docTemp.title = docTempDto.title;
    docTemp.address = docTempDto.address;
    docTemp.tel = docTempDto.tel;
    docTemp.facsimile = docTempDto.facsimile;
    docTemp.email = docTempDto.email;
    await docTemp.save();
  }

  async removeDocTemp(id: number) {
    let docTemp = new DocTemp();
    docTemp.id = id;
    await docTemp.remove();
  }
}
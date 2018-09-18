import { ApiModelProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class ReportDataDto {

  @ApiModelProperty()
  id: number;

  @ApiModelProperty({ description: '测量位置' })
  measurePoint: string;

  @ApiModelProperty({ description: '刻度因子', default: 1 })
  K: number = 1;

  @ApiModelProperty({ description: '10次测量值,平均值,标准差,结果  13个值' })
  values: string;

}

export class ReportDto {

  @ApiModelProperty()
  id: number;

  @ApiModelProperty({ description: '项目名称' })
  name: string;

  @ApiModelProperty({ description: '委托单位' })
  delegateUnit: string;

  @ApiModelProperty({ description: '测量人' })
  measurePerson: string;

  @ApiModelProperty({ description: '仪器型号和编号' })
  machineNO: string;

  @ApiModelProperty({ description: '任务编号' })
  taskNO: string;

  @ApiModelProperty({ description: '测量时间, unix时间戳' })
  measuredAt: number;

  @ApiModelProperty({ description: '检查类别' })
  type: string;

  @ApiModelProperty({ description: '天气状况' })
  weather: string;

  @ApiModelProperty({ description: '测量地址' })
  address: string;

  @ApiModelProperty({ description: '被检测单位' })
  unit: string;

  @ApiModelProperty({ description: '被检测单位联系人' })
  contactPerson: string;

  @ApiModelProperty({ description: '被检测单位联系人电话' })
  contactPersonTel: string;

  @ApiModelProperty({ description: 'GPS地址' })
  GPS: string;

  @ApiModelProperty({ description: '点位示意图' })
  sketchMap: string;

  @ApiModelProperty({ description: '文档模板ID' })
  docTempId: number;

  @ApiModelProperty({ description: '照片', type: String, isArray: true })
  pictures: string[];

  @ApiModelProperty({ description: '伽马剂量率记录表', type: ReportDataDto, isArray: true })
  data: ReportDataDto[];

  @ApiModelProperty({ description: '结论' })
  result: string;

}

export class ReportListReq {

  @IsInt()
  @IsOptional()
  @Type(() => Number)
  @ApiModelProperty({ description: '开始时间', required: false })
  startTime: number;

  @IsInt()
  @IsOptional()
  @Type(() => Number)
  @ApiModelProperty({ description: '结束时间', required: false })
  endTime: number;

  @IsString()
  @IsOptional()
  @ApiModelProperty({ description: '地点', required: false })
  address: string;

  @IsString()
  @IsOptional()
  @ApiModelProperty({ description: '测量人', required: false })
  measurePerson: string;

  @IsInt()
  @IsOptional()
  @Type(() => Number)
  @ApiModelProperty({ default: 10, required: false })
  readonly limit: number = 10;

  @IsInt()
  @IsOptional()
  @Type(() => Number)
  @ApiModelProperty({ default: 1, required: false })
  readonly page: number = 1;

}

export class ReportListDto {

  @ApiModelProperty({ type: ReportDto, isArray: true })
  reports: ReportDto[];

  @ApiModelProperty({ type: Number })
  count: number;

}

export class SketchMapDto {

  @ApiModelProperty()
  pic: string;

}

export class DocTempDto {

  @ApiModelProperty()
  id: number;

  @ApiModelProperty()
  title: string;

  @ApiModelProperty()
  address: string;

  @ApiModelProperty()
  tel: string;

  @ApiModelProperty()
  facsimile: string;

  @ApiModelProperty()
  email: string;

}
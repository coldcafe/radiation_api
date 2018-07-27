import { ApiModelProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class ReportDataDto {

  @ApiModelProperty({ description: '测量位置' })
  measurePoint: string;

  @ApiModelProperty({ description: '刻度因子', default: 1 })
  K: number = 1;

  @ApiModelProperty({ description: '10次测量值,平均值,标准差,结果', isArray: true, maxLength: 13, minLength: 13 })
  values: string;

}

export class ReportDto {

  @ApiModelProperty({ description: '测量人' })
  readonly measurePerson: string;

  @ApiModelProperty({ description: '仪器型号和编号' })
  readonly machineNO: string;

  @ApiModelProperty({ description: '任务编号' })
  readonly taskNO: string;

  @ApiModelProperty({ description: '测量时间, unix时间戳' })
  readonly measuredAt: number;

  @ApiModelProperty({ description: '检查类别' })
  readonly type: string;

  @ApiModelProperty({ description: '天气状况' })
  readonly weather: string;

  @ApiModelProperty({ description: '测量地址' })
  readonly address: string;

  @ApiModelProperty({ description: '被检测单位' })
  readonly unit: string;

  @ApiModelProperty({ description: '被检测单位联系人' })
  readonly contactPerson: string;

  @ApiModelProperty({ description: '被检测单位联系人电话' })
  readonly contactPersonTel: string;

  @ApiModelProperty({ description: 'GPS地址' })
  readonly GPS: string;

  @ApiModelProperty({ description: '照片, 上传七牛，传输七牛图片key到服务端保存', isArray: true })
  readonly pictures: string;

  @ApiModelProperty({ description: '伽马剂量率记录表', isArray: true })
  readonly data: ReportDataDto;

}

export class ReportListReq {

  @ApiModelProperty({ default: 10, required: false })
  readonly limit: number = 10;

  @ApiModelProperty({ default: 1, required: false })
  readonly page: number = 1;

}
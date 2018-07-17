import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { User } from '../entity/user';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [ReportsController],
  providers: [
    ReportsService,
  ],
})
export class ReportsModule {}
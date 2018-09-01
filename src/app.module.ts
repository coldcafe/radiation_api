import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './grards/roles.grards';
import { User } from './entity/user';
import { ReportsModule } from './reports/reports.module';
import { QiniuService } from './qiniu.service';

@Module({
  imports: [DatabaseModule, UsersModule, ReportsModule, TypeOrmModule.forFeature([User])],
  controllers: [AppController],
  providers: [AppService, QiniuService, { provide: APP_GUARD, useClass: RolesGuard }],
})

export class AppModule { }

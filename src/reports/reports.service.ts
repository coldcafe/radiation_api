import { Injectable, ForbiddenException } from '@nestjs/common';
import { User } from '../entity/user';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CONST } from '../config/constants';
import { ConfigService } from '../config/config.service';
import axios from 'axios';
import * as jwt from 'jsonwebtoken';
import {  } from './reports.dto';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {

  }

}
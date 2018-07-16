import * as jwt from 'jsonwebtoken';
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ReflectMetadata } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '../config/config.service';
import { User } from '../entity/user';
import { Repository } from 'typeorm';

export const Roles = (...roles: string[]) => ReflectMetadata('roles', roles);

@Injectable()
export class RolesGuard implements CanActivate {
  private readonly jwtSecret: string;
  constructor(
    private readonly reflector: Reflector,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly config: ConfigService,
  ) {
    this.jwtSecret = this.config.get('JWT_SECRET');
  }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }
    const req = context.switchToHttp().getRequest();
    if (!req.headers.authorization) {
      return false;
    }
    let decoded: any = jwt.verify(req.headers.authorization, this.jwtSecret);
    let userId = decoded.id;
    let user = await this.userRepository.findOne({ id: userId });
    if (!user) {
      return false;
    }
    req.userId = userId;
    const hasRole = roles.some(role => role === user.role);
    return hasRole;
  }
}
import { Injectable, Inject } from '@nestjs/common';
import { Cat } from '../entity/cat';
import { CatDto } from './cat.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CatsService {
  constructor(
    @InjectRepository(Cat)
    private readonly catRepository: Repository<Cat>,
  ) {}

  async create(catDto: CatDto) {
    const cat = new Cat();
    cat.age = catDto.age;
    cat.name = catDto.name;
    cat.breed = catDto.breed;
    await this.catRepository.save(cat);
  }

  async findAll(): Promise<Cat[]> {
    return this.catRepository.find();
  }
}
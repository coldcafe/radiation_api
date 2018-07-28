import { PipeTransform, Pipe, ArgumentMetadata, Injectable, BadRequestException } from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value, metadata: ArgumentMetadata) {
    const { metatype } = metadata;
    if (!metatype || !this.toValidate(metatype)) {
        return value;
    }
    const object = plainToClass(metatype, value);
    const errors = await validate(object);
    if (errors.length > 0) {
      let error = errors[0];
      let keys = Object.keys(error.constraints);
      let e = error.constraints[keys[0]];
      throw new BadRequestException(e);
    }
    return object;
  }

  private toValidate(metatype): boolean {
    const types = [String, Boolean, Number, Array, Object];
    return !types.find((type) => metatype === type);
  }

  private propertyParseInt(obj) {
    for (let key of Object.keys(obj)) {
      if (!isNaN(obj[key])) {
        obj[key] = parseInt(obj[key], 10);
      }
    }
    return obj;
  }
}

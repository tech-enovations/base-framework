import { PipeTransform } from '@nestjs/common';
import { Types } from 'mongoose';

export class ObjectIdPipe implements PipeTransform {
  public transform(value: string) {
    return new Types.ObjectId(value);
  }
}

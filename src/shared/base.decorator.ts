import { Schema } from '@nestjs/mongoose';
import { SchemaOptions } from 'mongoose';

export const BaseSchema = (collection: string, options: SchemaOptions = {}) => {
  options['collection'] = collection;
  options['timestamps'] = {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  };
  options['autoIndex'] = true;
  return Schema(options);
};

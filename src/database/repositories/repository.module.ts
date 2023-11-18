import { Module, Provider } from '@nestjs/common';
import { ModelDefinition, MongooseModule } from '@nestjs/mongoose';
import { Customer, CustomerSchema, File, FileSchema } from '../models';
import { CustomerRepository } from './customer.repository';
import { FileRepository } from './file.repository';

const baseProviders: Provider[] = [CustomerRepository, FileRepository];

const baseDefinitions: ModelDefinition[] = [
  {
    name: File.name,
    schema: FileSchema,
  },
  { name: Customer.name, schema: CustomerSchema },
];

const definitions = [...baseDefinitions];
const providers = [...baseProviders];
@Module({
  imports: [MongooseModule.forFeature(definitions)],
  providers,
  exports: providers,
})
export class RepositoryModule {}

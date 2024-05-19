import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Customer } from 'src/database/models';
import { BaseRepository } from './base.repository';

@Injectable()
export class CustomerRepository extends BaseRepository<Customer> {
  constructor(
    @InjectModel(Customer.name)
    private readonly _customerModel: Model<Customer>,
  ) {
    super(_customerModel);
  }

  public async findByUsername(username: string) {
    return this.findOneBy(
      {
        username,
        deletedAt: { $eq: null },
      },
      { lean: true },
    );
  }
}

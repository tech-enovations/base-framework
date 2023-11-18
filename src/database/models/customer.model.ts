import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { CUSTOMER_CONSTANTS } from 'src/constants';
import { BaseSchema } from 'src/shared';
import { BaseStatus, BaseUser } from './base.model';

@BaseSchema(CUSTOMER_CONSTANTS.SCHEMA_NAME)
export class Customer extends BaseUser {
  @Prop({ default: BaseStatus.Disabled })
  isSupportPortfolio?: BaseStatus;

  constructor(data: Partial<Customer>) {
    super(data);
    Object.assign(this, data);
  }

  static deserialize(data: Partial<Customer>) {
    return {
      _id: data._id,
      username: data.username,
      userType: data.userType,
      isSupportPortfolio: data.isSupportPortfolio,
    };
  }
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes } from 'mongoose';

export class BaseModel {
  _id?: string;

  @Prop({ type: SchemaTypes.Date })
  createdAt: Date;

  @Prop({ type: SchemaTypes.Date })
  updatedAt: Date;

  @Prop({ type: SchemaTypes.Date })
  deletedAt: Date;

  constructor(data?: Partial<BaseModel>) {
    this._id = data._id;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
    this.deletedAt = data.deletedAt;
  }
}

export enum UserType {
  Customer = 'customer',
}

export enum BaseStatus {
  Enabled = 'enabled',
  Disabled = 'disabled',
}

export class BaseUser extends BaseModel {
  @Prop()
  username: string;

  @Prop()
  password: string;

  @Prop({ default: UserType.Customer })
  userType: UserType;

  @Prop({ default: BaseStatus.Enabled })
  status: BaseStatus;

  @Prop()
  gender?: string;

  constructor(data?: Partial<BaseUser>) {
    super(data);
    this.username = data.username;
    this.password = data.password;
    this.userType = data.userType;
    this.status = data.status;
  }

  public serialize() {
    return {
      _id: this._id,
      username: this.username,
      userType: this.userType,
    };
  }

  static getSecret(userType: UserType) {
    const secret = {
      [UserType.Customer]: process.env.SECRET_CUSTOMER_JWT,
    };
    return secret[userType];
  }
}

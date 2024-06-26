import { Prop } from '@nestjs/mongoose';
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

export enum UserProvider {
  APP = 'app',
  GOOGLE = 'google',
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

  @Prop()
  refreshToken?: string;

  @Prop({ default: UserProvider.APP })
  provider: UserProvider;

  @Prop()
  providerIdentity: string;

  constructor(data?: Partial<BaseUser>) {
    super(data);
    this.username = data.username;
    this.password = data.password;
    this.userType = data.userType;
    this.status = data.status;
    this.refreshToken = data.refreshToken;
    this.provider = data.provider;
    this.providerIdentity = data.providerIdentity;
  }

  public serialize() {
    return {
      _id: this._id,
      username: this.username,
      userType: this.userType,
      provider: this.provider,
      providerIdentity: this.providerIdentity,
    };
  }

  static getSecret(userType: UserType) {
    switch (userType) {
      case UserType.Customer:
        return process.env.SECRET_CUSTOMER_JWT;
      default:
        throw new Error(`User type ${userType} not implemented!`);
    }
  }

  static getRefreshSecret(userType: UserType) {
    switch (userType) {
      case UserType.Customer:
        return process.env.REFRESH_SECRET_CUSTOMER_JWT;
      default:
        throw new Error(`User type ${userType} not implemented!`);
    }
  }
}

import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { FILE_CONSTANTS } from 'src/constants';
import { BaseSchema } from 'src/shared';
import { BaseModel, UserType } from './base.model';

@BaseSchema(FILE_CONSTANTS.SCHEMA_NAME)
export class File extends BaseModel {
  @Prop()
  name: string;

  @Prop()
  path: string;

  @Prop()
  mimetype: string;

  @Prop()
  size: number;

  @Prop()
  thumbnail: string;

  @Prop()
  user: string;

  @Prop()
  userType: UserType;

  @Prop()
  type: string;

  url?: string;

  constructor(data?: Partial<File>) {
    super(data);
    this.name = data.name;
    this.path = data.path;
    this.mimetype = data.mimetype;
    this.size = data.size;
    this.url = data.url;
    this.thumbnail = data.thumbnail;
    this.user = data.user;
    this.userType = data.userType;
  }
}

export const FileSchema = SchemaFactory.createForClass(File);

import { File } from 'src/database/models';
import { BaseRepository } from './base.repository';
import { Injectable } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class FileRepository extends BaseRepository<File> {
  constructor(
    @InjectModel(File.name)
    private readonly _fileModel: Model<File>,
  ) {
    super(_fileModel);
  }

  public async softDelete(id: Types.ObjectId, removedPath: string) {
    return this.updateById(id, {
      $set: {
        deletedAt: new Date(),
        path: removedPath,
      },
    });
  }

  public async recovery(id: Types.ObjectId, recoveryPath: string) {
    return this.updateById(id, {
      $set: {
        deletedAt: null,
        path: recoveryPath,
      },
    });
  }
}

import { Inject, Injectable } from '@nestjs/common';
import { CoreServices, IStorageService } from 'src/core/types';
import { BaseUser, File, FileRepository } from 'src/database';
import { BaseFilter } from 'src/shared';
import { asyncMap } from 'src/utils';

@Injectable()
export class FileService {
  constructor(
    @Inject(CoreServices.StorageService)
    private _storageService: IStorageService,
    private _fileRepository: FileRepository,
  ) {}
  public async uploadFiles(files: Express.Multer.File[], user: BaseUser) {
    return asyncMap(files, (file) => this.upload(file, user));
  }

  public async upload(fileUpload: Express.Multer.File, user: BaseUser) {
    const file = new File(fileUpload);
    file.name = fileUpload.originalname;
    file.user = user._id;
    file.userType = user.userType;

    const response = await this._storageService.uploadFile(fileUpload);
    file.path = response.path;
    file.url = response.url;
    file.thumbnail = response.thumbnail;

    const createdFile = await this._fileRepository.create(file);
    file._id = createdFile._id;
    return file;
  }

  public async list(filter: BaseFilter, user: BaseUser) {
    const query = this._fileRepository
      .buildQuery(filter)
      .where({
        user: user._id,
        userType: user.userType,
        deletedAt: { $eq: null },
        folder: { $ne: null },
      })
      .sort({ createdAt: 'desc' });
    return this._fileRepository.queryAndCount(query, filter);
  }

  public async removedFiles(filter: BaseFilter, user: BaseUser) {
    const query = this._fileRepository
      .buildQuery(filter)
      .where({
        user: user._id,
        userType: user.userType,
        deletedAt: { $ne: null },
      })
      .sort({ deletedAt: 'desc' });
    return this._fileRepository.queryAndCount(query, filter);
  }
}

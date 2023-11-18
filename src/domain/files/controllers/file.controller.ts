import {
  Controller,
  Get,
  Inject,
  Post,
  Query,
  Req,
  Res,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { Request, Response } from 'express';
import { uniqBy } from 'lodash';
import { CoreServices, IStorageService } from 'src/core/types';
import { BaseUser, File } from 'src/database';
import { CurrentUser, JwtAuthCustomerGuard } from 'src/domain/auth';
import { BaseController, BaseFilter } from 'src/shared';
import { asyncMap } from 'src/utils';
import { FileService } from '../services';

@Controller('files')
@UsePipes(new ValidationPipe())
@UseGuards(JwtAuthCustomerGuard)
export class FileController extends BaseController {
  constructor(
    private _fileService: FileService,
    @Inject(CoreServices.StorageService)
    private _storageService: IStorageService,
  ) {
    super();
  }

  @Get()
  public async list(
    @Query() filter: BaseFilter,
    @Req() request: Request,
    @Res() response: Response,
    @CurrentUser() user: BaseUser,
  ) {
    const { items, total } = await this._fileService.list(filter, user);
    this.responseCustom(response, await this._presignFile(items), { total });
  }

  @Get('removed')
  public async removedFiles(
    @Query() filter: BaseFilter,
    @Req() request: Request,
    @Res() response: Response,
    @CurrentUser() user: BaseUser,
  ) {
    const { items, total } = await this._fileService.removedFiles(filter, user);
    this.responseCustom(response, await this._presignFile(items), { total });
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  public async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Req() request: Request,
    @Res() response: Response,
    @CurrentUser() user: BaseUser,
  ) {
    const createdFile = await this._fileService.upload(file, user);
    this.responseCustom(response, createdFile);
  }

  @Post('upload-multi')
  @UseInterceptors(FilesInterceptor('files'))
  public async uploadFiles(
    @UploadedFiles() files: Express.Multer.File[],
    @Req() request: Request,
    @Res() response: Response,
    @CurrentUser() user: BaseUser,
  ) {
    const createdFiles = await this._fileService.uploadFiles(
      uniqBy(files, 'originalname'),
      user,
    );
    this.responseCustom(response, createdFiles);
  }

  private _presignFile(files: File[] = []) {
    return asyncMap(files, async (file) => {
      file.url = await this._storageService.presign(file.path);
      if (file.thumbnail) {
        file.thumbnail = await this._storageService.presign(file.thumbnail);
      }
      return file;
    });
  }
}

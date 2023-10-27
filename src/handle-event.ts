import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { LoggerService } from 'src/core/logger';
import {
  CoreServices,
  IStorageService,
  STORAGE_UPLOAD_EVENT,
} from './core/types';

@Injectable()
export class HandleEvent {
  private _logger = new LoggerService(HandleEvent.name);
  constructor(
    @Inject(CoreServices.StorageService)
    private _storageService: IStorageService,
  ) {}

  @OnEvent(STORAGE_UPLOAD_EVENT)
  public async handleClientRegisteredEvent(payload: any) {
    await this._storageService.s3.send(payload);
  }
}

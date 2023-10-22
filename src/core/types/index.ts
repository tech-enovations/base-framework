export * from './logger.types';
export * from './storage.types';

export enum CoreServices {
  LoggingService = 'ILogger',
  StorageService = 'IStorage',
  CachingService = 'ICaching',
}

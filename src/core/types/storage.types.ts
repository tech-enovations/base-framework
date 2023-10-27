import { S3Client } from '@aws-sdk/client-s3';

export interface IStorageService {
  s3: S3Client;
  uploadFile(file: Express.Multer.File): Promise<UploadResponse>;
  storePermanent(path: string, newFolder: string): Promise<UploadResponse>;
  remove(path: string): Promise<void>;
  presign(path: string): Promise<string>;
  getFilePath(url: string): string;
}

export type UploadResponse = {
  path: string;
  url: string;
};

export const STORAGE_UPLOAD_EVENT = 'Storage:UploadFile';

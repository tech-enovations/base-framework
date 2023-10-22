export interface IStorageService {
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

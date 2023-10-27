import {
  CopyObjectCommand,
  DeleteObjectCommand,
  PutObjectCommand,
  S3,
} from '@aws-sdk/client-s3';
import { getSignedUrl as getCloudFrontSignedUrl } from '@aws-sdk/cloudfront-signer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IStorageService, STORAGE_UPLOAD_EVENT } from '../../../core/types';
import { generateRandomId } from '../../../utils';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class AwsS3Service implements IStorageService {
  private _s3: S3;
  private _s3Bucket: string;
  private _temporaryFolder: string;
  private _urlPrefix: string;
  private _uploadPresignTTL = 30 * 60;
  private _cloudfrontEndpoint: string;
  private _cloudfrontKeyPairId: string;
  private _cloudfrontPrivateKey: string;

  constructor(
    private _configService: ConfigService,
    private _eventEmitter: EventEmitter2,
  ) {
    this._s3 = new S3({
      region: _configService.get('REGION'),
      credentials: {
        accessKeyId: _configService.get('AWS_ACCESS_KEY_ID'),
        secretAccessKey: _configService.get('AWS_SECRET_ACCESS_KEY'),
      },
    });
    this._temporaryFolder =
      _configService.get('S3_UPLOAD_FOLDER') || 'temporary';
    this._s3Bucket = _configService.get('S3_BUCKET');
    this._urlPrefix = `https://${this._s3Bucket}.s3.${_configService.get(
      'REGION',
    )}.amazonaws.com`;
    this._cloudfrontEndpoint = _configService.get(
      'CLOUDFRONT_STORAGE_ENDPOINT',
    );
    this._cloudfrontKeyPairId = _configService.get('CLOUDFRONT_KEY_PAIR_ID');
    this._cloudfrontPrivateKey = _configService.get('CLOUDFRONT_PRIVATE_KEY');
  }

  get s3() {
    return this._s3;
  }

  getUrl(path: string): string {
    return `${this._urlPrefix}/${path}`;
  }
  private _generateFilePath(): string {
    return `${this._temporaryFolder}/${generateRandomId()}`;
  }
  public async uploadFile(file: Express.Multer.File) {
    const filePath = this._generateFilePath();
    // let ContentType = file.mimetype;
    // if (FILE_CONSTANT.IMAGE_MIME_TYPES.includes(ContentType)) {
    //   ContentType = 'image/png';
    // }
    // if (FILE_CONSTANT.VIDEO_MIME_TYPES.includes(ContentType)) {
    //   ContentType = 'video/mp4';
    // }
    const command = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET,
      Body: file.buffer,
      Key: filePath,
      ContentType: file.mimetype,
    });
    this._eventEmitter.emit(STORAGE_UPLOAD_EVENT, command);
    // await this._s3.send(command);
    return {
      path: filePath,
      url: filePath,
    };
    return this._getS3UploadResponse(filePath);
  }
  async storePermanent(path: string, newFolder: string) {
    const filePath = this.getFilePath(path);
    const newFileKey = newFolder + '/' + filePath.split('/')[1];
    const command = new CopyObjectCommand({
      Bucket: this._s3Bucket,
      CopySource: '/' + this._s3Bucket + '/' + filePath,
      Key: newFileKey,
    });
    await this._s3.send(command);
    return this._getS3UploadResponse(newFileKey);
  }
  public async remove(path: string): Promise<void> {
    const fileKey = this.getFilePath(path);
    const command = new DeleteObjectCommand({
      Bucket: this._s3Bucket,
      Key: fileKey,
    });
    await this._s3.send(command);
  }

  private _getPresignPolicy(uri: string, ttl = 86400): string {
    const validUntil = Math.floor(Date.now() / 1000) + ttl;
    return JSON.stringify({
      Statement: [
        {
          Resource: `${process.env.CLOUDFRONT_STORAGE_ENDPOINT}/${uri}*`,
          Condition: {
            DateLessThan: {
              'AWS:EpochTime': validUntil,
            },
          },
        },
      ],
    });
  }

  public async presign(url: string): Promise<string> {
    const filePath = this.getFilePath(url);
    return getCloudFrontSignedUrl({
      keyPairId: this._cloudfrontKeyPairId,
      privateKey: this._cloudfrontPrivateKey,
      url: `${this._cloudfrontEndpoint}/${filePath}`,
      policy: this._getPresignPolicy(filePath),
    });
    return this._getUrl(filePath);
  }

  public getFilePath(path: string) {
    return path.replace(`${this._urlPrefix}/`, '').split('?')[0];
  }

  private async _getS3UploadResponse(path: string) {
    return {
      path,
      url: await this.presign(path),
    };
  }

  private _getUrl(path: string) {
    // const getObjectCommand = new GetObjectCommand({
    //   Bucket: this._s3Bucket,
    //   Key: path,
    // });
    // return getSignedUrl(this._s3, getObjectCommand, {
    //   expiresIn: this._uploadPresignTTL,
    // });
    return `${this._cloudfrontEndpoint}/${path}`;
  }
}

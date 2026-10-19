import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { FastifyRequest } from 'fastify';

import sharp from 'sharp';

import createClient from './client/minioClient';

import { StorageResponseDto } from './dtos/StorageResponseDto';
import { IStorage } from '../config/interfaces/storage.interface';
import { IUploadSettings } from './intefaces/UploadSettings.Interface';
import { IFileData } from './intefaces/FileData.Interface';
import { IRemoveSettings } from './intefaces/RemoveSettings.Interface';
import { IRenameSettings } from './intefaces/RenameSettings.Interface';

@Injectable()
export class StorageService {
  /*
    TODO: пересоздавать клиент нужно только тогда, когда он отвелился
   */

  constructor(private readonly configService: ConfigService) {}

  async uploadAvatar(
    req: FastifyRequest,
    settings: IUploadSettings
  ): Promise<any> {
    const promises = [];

    const uploadSettings = this.configService.get('storage') as IStorage;

    const S3_filename = settings.filename + '.png';

    return new Promise((resolve, reject) => {
      const mp = req.multipart(handler, onEnd);
      mp.on('file', (_, stream: any) => {
        stream.on('end', function () {
          if (stream.truncated) {
            reject(
              new BadRequestException(
                new StorageResponseDto(
                  400,
                  undefined,
                  'Maximum size of file reached'
                )
              )
            );
          }
        });
      });

      mp.on('partsLimit', () => {
        reject(
          new BadRequestException(
            new StorageResponseDto(
              400,
              undefined,
              'Maximum number of form parts reached'
            )
          )
        );
      });

      mp.on('filesLimit', () => {
        reject(
          new BadRequestException(
            new StorageResponseDto(
              400,
              undefined,
              'Maximum number of files reached'
            )
          )
        );
      });

      mp.on('fieldsLimit', () => {
        reject(
          new BadRequestException(
            new StorageResponseDto(
              400,
              undefined,
              'Maximum number of fields reached'
            )
          )
        );
      });

      function onEnd(err: string | Record<string, any>) {
        if (err) {
          reject(new HttpException(err, 500));
        } else {
          Promise.all(promises).then(
            (_) => {
              resolve({ result: 'OK' });
            },
            (err) => {
              reject(new HttpException(err, 500));
            }
          );
        }
      }

      function handler(
        _field: any,
        file: { pipe: (arg0: any) => any },
        _filename: any,
        _encoding: any,
        mimetype: string
      ) {
        if (mimetype && mimetype.match(/^image\/(.*)/)) {
          //const imageType = mimetype.match(/^image\/(.*)/)[1];

          const s3Stream = createClient(uploadSettings);

          const promise = s3Stream
            .upload({
              Bucket: settings.bucket,
              Key: `${S3_filename}`,
              Body: file.pipe(
                sharp().resize(settings.width, settings.height)['webp']()
              )
            })
            .promise();

          promises.push(promise);
        }
      }
    });
  }

  async uploadToS3(
    file: IFileData,
    uploadSettings: IUploadSettings
  ): Promise<string> {
    const settings = this.configService.get('storage') as IStorage;

    try {
      if (file.mimetype.match(/^image\/(.*)/)) {
        const s3Stream = createClient(settings);

        const rs = file.createReadStream();

        const response = await s3Stream
          .upload({
            Bucket: uploadSettings.bucket,
            Key: uploadSettings.filename,
            Body: rs.pipe(
              sharp().resize(uploadSettings.width, uploadSettings.height).webp()
            )
          })
          .promise();

        return response.Location;
      }
    } catch (e) {
      console.error(e);
      return '';
    }
  }

  async removeFromS3(removeSettings: IRemoveSettings): Promise<boolean> {
    const settings = this.configService.get('storage') as IStorage;

    try {
      const s3Stream = createClient(settings);

      await s3Stream
        .deleteObject({
          Bucket: removeSettings.bucket,
          Key: removeSettings.filename
        })
        .promise();

      return true;
    } catch (e) {
      console.error(e);

      return false;
    }
  }

  async renameS3Object(renameSettings: IRenameSettings): Promise<boolean> {
    const settings = this.configService.get('storage') as IStorage;

    try {
      const s3Stream = createClient(settings);

      await s3Stream
        .copyObject({
          Bucket: renameSettings.bucket,
          CopySource: renameSettings.from,
          Key: renameSettings.to
        })
        .promise()
        .then(() => {
          s3Stream
            .deleteObject({
              Bucket: renameSettings.bucket,
              Key: renameSettings.from
            })
            .promise();
        });
    } catch (e) {
      console.error(e);
      return false;
    }
  }
}

import { S3 } from 'aws-sdk';

import { IStorage } from '../../config/interfaces/storage.interface';

// TODO: убрать @deprecated поля
export default function createClient(storage: IStorage) {
  console.log(storage);
  return new S3({
    accessKeyId: storage.accessKey,
    secretAccessKey: storage.secretKey,
    endpoint: storage.endpoint,
    s3ForcePathStyle: true,
    signatureVersion: 'v4'
  });
}

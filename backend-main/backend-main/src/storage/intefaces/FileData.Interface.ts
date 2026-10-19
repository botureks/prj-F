import { Readable } from 'stream';

export interface IFileData {
  fieldName: string;
  filename: string;
  mimetype: string;
  encoding: string;
  createReadStream: () => Readable;
}

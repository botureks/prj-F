import { RedisOptions } from 'ioredis';
import { MikroOrmModuleOptions } from '@mikro-orm/nestjs';

import { IJwt } from './jwt.interface';
import { IUpload } from './upload.interface';
import { IStorage } from './storage.interface';

export interface IConfig {
  readonly id: string;
  readonly domain: string;
  readonly port: number;
  readonly db: MikroOrmModuleOptions;
  readonly jwt: IJwt;
  readonly redis: RedisOptions;
  readonly storage: IStorage;
  readonly upload: IUpload;
  readonly testing: boolean;
}

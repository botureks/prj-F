import { readFileSync } from 'fs';
import { join } from 'path';

import { defineConfig as definePGConfig } from '@mikro-orm/postgresql';
import { defineConfig as defineSqliteConfig } from '@mikro-orm/sqlite';

import { LoadStrategy } from '@mikro-orm/core';

import { IConfig } from './interfaces/config.interface';
import { redisUrlParser } from '../common/utils/redis-url-parser.util';

export function config(): IConfig {
  const publicKey = readFileSync(
    join(__dirname, '..', '..', 'keys/public_key.pem'),
    'utf-8'
  );
  const privateKey = readFileSync(
    join(__dirname, '..', '..', 'keys/private_key.pem'),
    'utf-8'
  );

  const testing = process.env.NODE_ENV !== 'production';
  const dbOptions = {
    entities: ['dist/**/*.entity.js', 'dist/**/*.embeddable.js'],
    entitiesTs: ['src/**/*.entity.ts', 'src/**/*.embeddable.ts'],
    loadStrategy: LoadStrategy.JOINED,
    allowGlobalContext: true
  };

  return {
    id: process.env.APP_ID,
    domain: process.env.DOMAIN,
    port: parseInt(process.env.PORT, 10),
    redis: redisUrlParser(process.env.REDIS_URL),
    jwt: {
      access: {
        privateKey,
        publicKey,
        time: parseInt(process.env.JWT_ACCESS_TIME, 10)
      },
      refresh: {
        secret: process.env.JWT_REFRESH_SECRET,
        time: parseInt(process.env.JWT_REFRESH_TIME, 10)
      }
    },
    db: testing
      ? defineSqliteConfig({
          ...dbOptions,
          dbName: ':memory:'
        })
      : definePGConfig({
          ...dbOptions,
          clientUrl: process.env.DATABASE_URL
        }),
    storage: {
      accessKey: process.env.STORAGE_ACCESS_KEY,
      secretKey: process.env.STORAGE_SECRET_KEY,
      endpoint: process.env.STORAGE_ENDPOINT,
      publicEndpoint: process.env.STORAGE_PUBLIC_ENDPOINT
    },
    upload: {
      maxFileSize: parseInt(process.env.UPLOAD_MAX_FILE_SIZE, 10),
      maxFiles: parseInt(process.env.UPLOAD_MAX_FILES, 10)
    },
    testing
  };
}

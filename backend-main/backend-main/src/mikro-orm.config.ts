import { join } from 'path';

import dotenv from 'dotenv';

import { LoadStrategy, Options } from '@mikro-orm/core';
import { defineConfig as definePGConfig } from '@mikro-orm/postgresql';
import { defineConfig as defineSqliteConfig } from '@mikro-orm/sqlite';
import { Migrator } from '@mikro-orm/migrations';

dotenv.config({
  path: join(__dirname, '..', '.env')
});

const baseOptions = {
  entities: ['dist/**/*.entity.js', 'dist/**/*.embeddable.js'],
  entitiesTs: ['src/**/*.entity.ts', 'src/**/*.embeddable.ts'],
  loadStrategy: LoadStrategy.JOINED,
  allowGlobalContext: true
};

const config: Options =
  process.env.NODE_ENV === 'production'
    ? definePGConfig({
        ...baseOptions,
        extensions: [Migrator],
        clientUrl: process.env.DATABASE_URL
      })
    : defineSqliteConfig({
        ...baseOptions,
        //dbName: ':memory:',
        extensions: [Migrator],
        clientUrl: process.env.DATABASE_URL
      });

export default config;

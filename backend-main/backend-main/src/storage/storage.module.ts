import { Module } from '@nestjs/common';

import { StorageResolver } from './storage.resolver';
import { StorageService } from './storage.service';

@Module({
  exports: [StorageService],
  providers: [StorageService, StorageResolver]
})
export class StorageModule {}
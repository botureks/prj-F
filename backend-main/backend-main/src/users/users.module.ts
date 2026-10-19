import { forwardRef, Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';

import { UserEntity } from './entities/user.entity';

import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { StorageModule } from '../storage/storage.module';

@Module({
  imports: [
    MikroOrmModule.forFeature([UserEntity]),
    forwardRef(() => StorageModule)
  ],
  providers: [UsersService, UsersResolver],
  exports: [UsersService]
})
export class UsersModule {}

import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';

import { TagEntity } from './entities/tag.entity';

import { TagsService } from './tags.service';
import { TagsResolver } from './tags.resolver';

@Module({
  imports: [MikroOrmModule.forFeature([TagEntity])],
  providers: [TagsService, TagsResolver],
  exports: [TagsService]
})
export class TagsModule {}
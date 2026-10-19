import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';

import { PostEntity } from './entities/post.entity';
import { PostsService } from './posts.service';
import { PostsResolver } from './posts.resolver';
import { UserEntity } from '../users/entities/user.entity';

@Module({
  imports: [MikroOrmModule.forFeature([PostEntity, UserEntity])],
  providers: [PostsService, PostsResolver],
  exports: [PostsService]
})
export class PostsModule {}
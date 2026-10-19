import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';

import { UserEntity } from '../users/entities/user.entity';

import { CommentsService } from './comments.service';
import { CommentsResolver } from './comments.resolver';
import { CommentEntity } from './entities/comment.entity';

@Module({
  imports: [MikroOrmModule.forFeature([CommentEntity, UserEntity])],
  providers: [CommentsService, CommentsResolver],
  exports: [CommentsService]
})
export class CommentsModule {}

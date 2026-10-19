import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { CommentEntity } from './entities/comment.entity';
import { CommentsService } from './comments.service';

import { CreateCommentInput } from './dto/create-comment.input';
import { UpdateCommentInput } from './dto/update-comment.input';

import { IComment } from './interfaces/comment.interface';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Public } from '../auth/decorators/public.decorator';

@Resolver(() => CommentEntity)
export class CommentsResolver {
  constructor(private commentsService: CommentsService) {}

  @Public()
  @Query(() => [CommentEntity])
  async comments(@Args('postId') postId: string): Promise<IComment[]> {
    return this.commentsService.getAllComments(postId);
  }

  @Public()
  @Query(() => CommentEntity, { nullable: true })
  async comment(@Args('id') id: string): Promise<IComment | null> {
    return this.commentsService.getCommentById(id);
  }

  @Public()
  @Query(() => [CommentEntity])
  async repliesForComment(
    @Args('commentId') commentId: string
  ): Promise<IComment[]> {
    return this.commentsService.getRepliesForComment(commentId);
  }

  @Mutation(() => CommentEntity)
  async createComment(
    @Args('createCommentInput') createCommentInput: CreateCommentInput,
    @CurrentUser() userId: string
  ): Promise<IComment> {
    return this.commentsService.createComment(userId, createCommentInput);
  }

  @Mutation(() => CommentEntity)
  async updateComment(
    @Args('id') id: string,
    @Args('updateCommentInput') updateCommentInput: UpdateCommentInput
  ): Promise<IComment> {
    return this.commentsService.updateComment(id, updateCommentInput);
  }

  @Mutation(() => Boolean)
  async deleteComment(@Args('id') id: string): Promise<boolean> {
    await this.commentsService.deleteComment(id);
    return true;
  }
}

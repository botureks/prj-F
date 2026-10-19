import { Injectable } from '@nestjs/common';

import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';

import { v4 } from 'uuid';

import { CommentEntity } from './entities/comment.entity';

import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

import { UserEntity } from '../users/entities/user.entity';

import { IComment } from './interfaces/comment.interface';

import { CommonService } from '../common/common.service';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(CommentEntity)
    private commentRepository: EntityRepository<CommentEntity>,
    @InjectRepository(UserEntity)
    private userRepository: EntityRepository<UserEntity>,
    private readonly commonService: CommonService
  ) {}

  async createComment(
    userId: string,
    createCommentDto: CreateCommentDto
  ): Promise<IComment> {
    const user = await this.userRepository.findOne(userId);

    const comment = this.commentRepository.create({
      ...createCommentDto,
      id: v4(),
      author: user
    });

    await this.commonService.saveEntity(this.commentRepository, comment, true);
    return comment;
  }

  async updateComment(
    id: string,
    updateCommentDto: UpdateCommentDto
  ): Promise<IComment> {
    const comment = await this.commentRepository.findOne(id);

    this.commentRepository.assign(comment, updateCommentDto);

    await this.commentRepository.getEntityManager().flush();

    return comment;
  }

  async deleteComment(id: string): Promise<void> {
    const comment = this.commentRepository.findOne({ id });
    if (!comment) {
      return;
    }

    await this.commentRepository.getEntityManager().remove(comment).flush();
  }

  async getCommentById(id: string): Promise<IComment | null> {
    const comment = await this.commentRepository.findOne(id);

    // @ts-ignore
    await this.commentRepository.populate(comment, ['author.username']);

    return comment;
  }

  async getAllComments(postId: string): Promise<IComment[]> {
    const comments = await this.commentRepository.findAll({
      where: { postId }
    });

    for (const comment of comments) {
      // @ts-ignore
      await this.commentRepository.populate(comment, ['author.username']);
    }

    return comments.reverse();
  }

  async getRepliesForComment(commentId: string): Promise<IComment[]> {
    return this.commentRepository.find({ replyTo: commentId });
  }
}

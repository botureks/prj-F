import { ForbiddenException, Injectable } from '@nestjs/common';

import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';

import { v4 } from 'uuid';

import { CommentEntity } from './entities/comment.entity';

import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

import { UserEntity } from '../users/entities/user.entity';
import { UserRole } from '../users/enums/user-role.enum';

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
    userId: string,
    updateCommentDto: UpdateCommentDto
  ): Promise<IComment> {
    const comment = await this.commentRepository.findOne(id);

    // @ts-ignore
    await this.commentRepository.populate(comment, ['author']);

    if (comment.author.id !== userId) {
      throw new ForbiddenException();
    }

    this.commentRepository.assign(comment, updateCommentDto);

    comment.editedAt = new Date();
    comment.isEdited = true;

    await this.commentRepository.getEntityManager().flush();

    return comment;
  }

  async deleteComment(id: string, userId: string): Promise<void> {
    const comment = await this.commentRepository.findOne(id, {
      populate: ['author']
    });

    if (!comment) {
      return;
    }

    if (comment.author.id !== userId) {
      const user = await this.userRepository.findOne(userId);

      if (!user || user.role !== UserRole.ADMIN) {
        throw new ForbiddenException();
      }
    }

    await this.commentRepository.getEntityManager().removeAndFlush(comment);
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
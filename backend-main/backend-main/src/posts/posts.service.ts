import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException
} from '@nestjs/common';

import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';

import { v4 } from 'uuid';

import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

import { PostEntity } from './entities/post.entity';
import { UserEntity } from '../users/entities/user.entity';
import { TagEntity } from '../tags/entities/tag.entity';
import { UserRole } from '../users/enums/user-role.enum';

import { CommonService } from '../common/common.service';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostEntity)
    private readonly postRepository: EntityRepository<PostEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: EntityRepository<UserEntity>,
    @InjectRepository(TagEntity)
    private readonly tagRepository: EntityRepository<TagEntity>,
    private readonly commonService: CommonService
  ) {}

  private async resolveTags(tagIds?: string[]): Promise<TagEntity[]> {
    if (!tagIds?.length) {
      return [];
    }

    const uniqueTagIds = [...new Set(tagIds)];
    const tags = await this.tagRepository.find({
      id: { $in: uniqueTagIds }
    });

    if (tags.length !== uniqueTagIds.length) {
      throw new BadRequestException('One or more tags were not found');
    }

    return tags;
  }

  public async createPost(
    userId: string,
    createPostDto: CreatePostDto
  ): Promise<PostEntity> {
    const user = await this.userRepository.findOne(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const tags = await this.resolveTags(createPostDto.tagIds);

    const post = this.postRepository.create({
      id: v4(),
      author: user,
      title: createPostDto.title,
      topic: createPostDto.topic,
      content: createPostDto.content,
      tags
    });

    await this.commonService.saveEntity(this.postRepository, post, true);

    return post;
  }

  public async updatePost(
    id: string,
    userId: string,
    updatePostDto: UpdatePostDto
  ): Promise<PostEntity> {
    const post = await this.postRepository.findOne(id, {
      populate: ['author', 'tags']
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (post.author.id !== userId) {
      throw new ForbiddenException();
    }

    const { tagIds, ...postData } = updatePostDto;

    this.postRepository.assign(post, postData);

    if (tagIds !== undefined) {
      const tags = await this.resolveTags(tagIds);
      post.tags.set(tags);
    }

    post.editedAt = new Date();
    post.isEdited = true;

    await this.postRepository.getEntityManager().flush();

    return post;
  }

  public async deletePost(id: string, userId: string): Promise<void> {
    const post = await this.postRepository.findOne(id, {
      populate: ['author']
    });

    if (!post) {
      return;
    }

    if (post.author.id !== userId) {
      const user = await this.userRepository.findOne(userId);

      if (!user || user.role !== UserRole.ADMIN) {
        throw new ForbiddenException();
      }
    }

    await this.postRepository.getEntityManager().removeAndFlush(post);
  }

  public async getPostById(id: string): Promise<PostEntity | null> {
    return this.postRepository.findOne(id, {
      populate: ['author', 'tags']
    });
  }

  public async getAllPosts(): Promise<PostEntity[]> {
    const posts = await this.postRepository.findAll({
      populate: ['author', 'tags']
    });

    return posts.reverse();
  }
}
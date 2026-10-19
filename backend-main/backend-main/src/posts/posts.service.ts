import { ForbiddenException, Injectable } from '@nestjs/common';

import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';

import { v4 } from 'uuid';

import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

import { PostEntity } from './entities/post.entity';
import { UserEntity } from '../users/entities/user.entity';
import { TagEntity } from '../tags/entities/tag.entity';

import { CommonService } from '../common/common.service';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostEntity)
    private postRepository: EntityRepository<PostEntity>,

    @InjectRepository(UserEntity)
    private userRepository: EntityRepository<UserEntity>,

    @InjectRepository(TagEntity)
    private tagRepository: EntityRepository<TagEntity>,

    private readonly commonService: CommonService
  ) {}

  async createPost(
    userId: string,
    createPostDto: CreatePostDto
  ): Promise<PostEntity> {
    const user = await this.userRepository.findOne(userId);

    const tags = createPostDto.tagIds
      ? await this.tagRepository.find({
          id: { $in: createPostDto.tagIds }
        })
      : [];

    const post = this.postRepository.create({
      title: createPostDto.title,
      topic: createPostDto.topic,
      content: createPostDto.content,
      id: v4(),
      author: user,
      tags
    });

    await this.commonService.saveEntity(this.postRepository, post, true);

    return post;
  }

  async updatePost(
    id: string,
    userId: string,
    updatePostDto: UpdatePostDto
  ): Promise<PostEntity> {
    const post = await this.postRepository.findOne(id);

    // @ts-ignore
    await this.postRepository.populate(post, ['author']);

    if (post.author.id !== userId) {
      throw new ForbiddenException();
    }

    const { tagIds, ...postData } = updatePostDto;

    this.postRepository.assign(post, postData);

    if (tagIds !== undefined) {
      const tags = await this.tagRepository.find({
        id: { $in: tagIds }
      });

      post.tags = tags;
    }

    post.editedAt = new Date();
    post.isEdited = true;

    await this.postRepository.getEntityManager().flush();

    return post;
  }

  async deletePost(id: string): Promise<void> {
    const post = await this.postRepository.findOne({ id });

    if (!post) {
      return;
    }

    await this.postRepository.getEntityManager().remove(post).flush();
  }

  async getPostById(id: string): Promise<PostEntity | null> {
    const post = await this.postRepository.findOne(id);

    if (!post) {
      return null;
    }

    // @ts-ignore
    await this.postRepository.populate(post, ['author.username']);

    return post;
  }

  async getAllPosts(): Promise<PostEntity[]> {
    const posts = await this.postRepository.findAll();

    for (const post of posts) {
      // @ts-ignore
      await this.postRepository.populate(post, ['author.username']);
    }

    console.log('Posts in DB:', posts);

    return posts.reverse();
  }
}
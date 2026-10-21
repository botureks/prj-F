import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { PostEntity } from './entities/post.entity';
import { PostsService } from './posts.service';

import { CreatePostInput } from './dto/create-post.input';
import { UpdatePostInput } from './dto/update-post.input';

import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Public } from '../auth/decorators/public.decorator';

@Resolver(() => PostEntity)
export class PostsResolver {
  constructor(private postsService: PostsService) {}

  @Public()
  @Query(() => [PostEntity])
  async posts(
    @Args('search', { type: () => String, nullable: true }) search?: string,
    @Args('tagIds', { type: () => [String], nullable: true }) tagIds?: string[]
  ): Promise<PostEntity[]> {
    return this.postsService.getAllPosts(search, tagIds);
  }

  @Public()
  @Query(() => [PostEntity])
  async postsByUser(@Args('userId') userId: string): Promise<PostEntity[]> {
    return this.postsService.getPostsByUser(userId);
  }

  @Public()
  @Query(() => PostEntity, { nullable: true })
  async post(@Args('id') id: string): Promise<PostEntity | null> {
    return this.postsService.getPostById(id);
  }

  @Mutation(() => PostEntity)
  async createPost(
    @Args('createPostInput') createPostInput: CreatePostInput,
    @CurrentUser() userId: string
  ): Promise<PostEntity> {
    return this.postsService.createPost(userId, createPostInput);
  }

  @Mutation(() => PostEntity)
  async updatePost(
    @Args('id') id: string,
    @Args('updatePostInput') updatePostInput: UpdatePostInput,
    @CurrentUser() userId: string
  ): Promise<PostEntity> {
    return this.postsService.updatePost(id, userId, updatePostInput);
  }

  @Mutation(() => Boolean)
  async deletePost(
    @Args('id') id: string,
    @CurrentUser() userId: string
  ): Promise<boolean> {
    await this.postsService.deletePost(id, userId);
    return true;
  }
}
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
  async posts(): Promise<PostEntity[]> {
    return this.postsService.getAllPosts();
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
  ): Promise<PostEntity> {
    return this.postsService.updatePost(id, updatePostInput);
  }

  @Mutation(() => Boolean)
  async deletePost(@Args('id') id: string): Promise<boolean> {
    await this.postsService.deletePost(id);
    return true;
  }
}

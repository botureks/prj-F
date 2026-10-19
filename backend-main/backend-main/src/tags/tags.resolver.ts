import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { TagsService } from './tags.service';

import { TagEntity } from './entities/tag.entity';

import { CreateTagInput } from './dto/create-tag.input';
import { UpdateTagInput } from './dto/update-tag.input';

import { ITag } from './interfaces/tag.interface';

@Resolver(() => TagEntity)
export class TagsResolver {
  constructor(private readonly tagsService: TagsService) {}

  @Query(() => [TagEntity])
  public async tags(): Promise<ITag[]> {
    return this.tagsService.getAllTags();
  }

  @Query(() => TagEntity, { nullable: true })
  public async tag(
    @Args('id') id: string
  ): Promise<ITag | null> {
    return this.tagsService.getTagById(id);
  }

  @Mutation(() => TagEntity)
  public async createTag(
    @Args('createTagInput') createTagInput: CreateTagInput
  ): Promise<ITag> {
    return this.tagsService.createTag(createTagInput);
  }

  @Mutation(() => TagEntity)
  public async updateTag(
    @Args('id') id: string,
    @Args('updateTagInput') updateTagInput: UpdateTagInput
  ): Promise<ITag> {
    return this.tagsService.updateTag(id, updateTagInput);
  }

  @Mutation(() => Boolean)
  public async deleteTag(
    @Args('id') id: string
  ): Promise<boolean> {
    await this.tagsService.deleteTag(id);

    return true;
  }
}
import { Injectable, NotFoundException } from '@nestjs/common';

import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';

import { v4 } from 'uuid';

import { TagEntity } from './entities/tag.entity';

import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';

import { ITag } from './interfaces/tag.interface';

import { CommonService } from '../common/common.service';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(TagEntity)
    private readonly tagRepository: EntityRepository<TagEntity>,
    private readonly commonService: CommonService
  ) {}

  public async createTag(createTagDto: CreateTagDto): Promise<ITag> {
    const tag = this.tagRepository.create({
      id: v4(),
      name: createTagDto.name,
      slug: this.commonService.generateSlug(createTagDto.name),
      color: createTagDto.color
    });

    await this.commonService.saveEntity(
      this.tagRepository,
      tag,
      true
    );

    return tag;
  }

  public async getAllTags(): Promise<ITag[]> {
    return this.tagRepository.findAll();
  }

  public async getTagById(id: string): Promise<ITag | null> {
    return this.tagRepository.findOne(id);
  }

  public async updateTag(
    id: string,
    updateTagDto: UpdateTagDto
  ): Promise<ITag> {
    const tag = await this.tagRepository.findOne(id);

    if (!tag) {
      throw new NotFoundException('Tag not found');
    }

    if (updateTagDto.name) {
      tag.name = updateTagDto.name;
      tag.slug = this.commonService.generateSlug(updateTagDto.name);
    }

    if (updateTagDto.color !== undefined) {
      tag.color = updateTagDto.color;
    }

    await this.tagRepository.getEntityManager().flush();

    return tag;
  }

  public async deleteTag(id: string): Promise<void> {
    const tag = await this.tagRepository.findOne(id);

    if (!tag) {
      throw new NotFoundException('Tag not found');
    }

    await this.tagRepository.getEntityManager().removeAndFlush(tag);
  }
}
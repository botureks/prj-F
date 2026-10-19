import { Entity, ManyToOne, PrimaryKey } from '@mikro-orm/core';
import { Field, ID, ObjectType } from '@nestjs/graphql';

import { IsUUID } from 'class-validator';

import { PostEntity } from './post.entity';
import { TagEntity } from '../../tags/entities/tag.entity';

@ObjectType()
@Entity({ tableName: 'post_tags' })
export class PostTagEntity {
  @Field(() => ID)
  @PrimaryKey()
  @IsUUID()
  public id: string;

  @ManyToOne(() => PostEntity)
  public post: PostEntity;

  @ManyToOne(() => TagEntity)
  public tag: TagEntity;
}
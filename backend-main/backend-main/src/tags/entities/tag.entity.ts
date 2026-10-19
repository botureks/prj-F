import {
  Collection,
  Entity,
  ManyToMany,
  PrimaryKey,
  Property
} from '@mikro-orm/core';
import { Field, ID, ObjectType } from '@nestjs/graphql';

import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

import { ITag } from '../interfaces/tag.interface';
import { PostEntity } from '../../posts/entities/post.entity';

@ObjectType()
@Entity({ tableName: 'tags' })
export class TagEntity implements ITag {
  @Field(() => ID)
  @PrimaryKey()
  @IsUUID()
  id: string;

  @Field(() => String)
  @Property({ unique: true })
  @IsNotEmpty()
  @IsString()
  name: string;

  @Field(() => String)
  @Property({ unique: true })
  @IsNotEmpty()
  @IsString()
  slug: string;

  @Field(() => String, { nullable: true })
  @Property({ nullable: true })
  @IsString()
  color?: string;

  @Field(() => [PostEntity])
  @ManyToMany(() => PostEntity, post => post.tags, {
    mappedBy: 'tags'
  })
  posts = new Collection<PostEntity>(this);

  @Field()
  @Property({ onCreate: () => new Date() })
  createdAt: Date = new Date();

  @Field()
  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();
}
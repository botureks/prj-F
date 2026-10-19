import { Field, ID, ObjectType } from '@nestjs/graphql';
import {
  Collection,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryKey,
  Property
} from '@mikro-orm/core';
import { IsString, IsUUID, Length } from 'class-validator';

import { IPost } from '../interfaces/post.interface';
import { UserEntity } from '../../users/entities/user.entity';
import { TagEntity } from '../../tags/entities/tag.entity';

@ObjectType()
@Entity({ tableName: 'posts' })
export class PostEntity implements IPost {
  @Field(() => ID)
  @PrimaryKey()
  @IsUUID()
  public id: string;

  @Field(() => UserEntity)
  @ManyToOne(() => UserEntity)
  public author: UserEntity;

  @Field()
  @Property({ columnType: 'text' })
  @IsString()
  public title: string;

  @Field()
  @Property({ columnType: 'varchar', length: 32 })
  @IsString()
  @Length(1, 32)
  public topic: string;

  @Field()
  @Property({ columnType: 'text' })
  @IsString()
  public content: string;

  @Field(() => [TagEntity])
  @ManyToMany(() => TagEntity)
  public tags = new Collection<TagEntity>(this);

  @Field()
  @Property({ onCreate: () => new Date() })
  public createdAt: Date = new Date();

  @Field()
  @Property({ onUpdate: () => new Date() })
  public updatedAt: Date = new Date();

  @Field({ nullable: true })
  @Property({ nullable: true })
  public editedAt?: Date;

  @Field()
  @Property({ default: false })
  public isEdited: boolean = false;
}
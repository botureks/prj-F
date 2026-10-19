import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID
} from 'class-validator';

import { UserEntity } from '../../users/entities/user.entity';
import { IComment } from '../interfaces/comment.interface';

@ObjectType()
@Entity({ tableName: 'comments' })
export class CommentEntity implements IComment {
  @Field(() => ID)
  @PrimaryKey()
  @IsUUID()
  id: string;

  @Field(() => ID)
  @Property()
  @IsNotEmpty()
  @IsUUID()
  postId: string;

  @Field(() => UserEntity)
  @ManyToOne(() => UserEntity)
  author: UserEntity;

  @Field(() => ID, { nullable: true })
  @Property({ nullable: true })
  @IsOptional()
  @IsUUID()
  replyTo?: string;

  @Field()
  @Property({ columnType: 'text' })
  @IsNotEmpty()
  @IsString()
  content: string;

  @Field(() => Number)
  @Property({ columnType: 'int', default: 0 })
  @IsNumber()
  views: number = 0;

  @Field()
  @Property({ onCreate: () => new Date() })
  createdAt: Date = new Date();

  @Field()
  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();
}

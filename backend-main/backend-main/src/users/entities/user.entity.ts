import { Embedded, Entity, PrimaryKey, Property } from '@mikro-orm/core';
import {
  IsOptional,
  IsString,
  IsUUID,
  Length,
  Matches,
  MaxLength
} from 'class-validator';
import { Field, ID, ObjectType } from '@nestjs/graphql';

import { IUser } from '../interfaces/user.interface';
import { BCRYPT_HASH } from '../../common/consts/regex.const';
import { CredentialsEmbeddable } from '../embeddables/credentials.embeddable';

@ObjectType()
@Entity({ tableName: 'users' })
export class UserEntity implements IUser {
  @Field(() => ID)
  @PrimaryKey()
  @IsUUID()
  public id: string;

  @Field(() => String)
  @Property({ columnType: 'varchar', length: 16 })
  public username: string;

  @Property({ columnType: 'varchar', length: 60 })
  @IsString()
  @Length(59, 60)
  @Matches(BCRYPT_HASH)
  public password: string;

  @Field(() => String, { nullable: true })
  @Property({ columnType: 'varchar', length: 250, nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(250)
  public picture?: string;

  @Embedded(() => CredentialsEmbeddable)
  public credentials: CredentialsEmbeddable = new CredentialsEmbeddable();

  @Property({ onCreate: () => new Date() })
  public createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  public updatedAt: Date = new Date();
}

import { Embedded, Entity, PrimaryKey, Property } from '@mikro-orm/core';
import {
  IsBoolean,
  IsEnum,
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
import { UserRole } from '../enums/user-role.enum';

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

  @Field(() => String, { nullable: true })
  @Property({ columnType: 'varchar', length: 300, nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(300)
  public description?: string | null;

  @Field(() => UserRole)
  @Property({ columnType: 'varchar', length: 16, default: UserRole.USER })
  @IsEnum(UserRole)
  public role: UserRole = UserRole.USER;

  @Field(() => Boolean)
  @Property({ default: false })
  @IsBoolean()
  public isBlocked: boolean = false;

  @Embedded(() => CredentialsEmbeddable)
  public credentials: CredentialsEmbeddable = new CredentialsEmbeddable();

  @Field()
  @Property({ onCreate: () => new Date() })
  public createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  public updatedAt: Date = new Date();
}
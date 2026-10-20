import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType('UserProfile')
export class UserProfileType {
  @Field(() => ID)
  public id: string;

  @Field(() => String)
  public username: string;

  @Field(() => String, { nullable: true })
  public picture?: string | null;

  @Field(() => String, { nullable: true })
  public description?: string | null;

  @Field()
  public createdAt: Date;
}
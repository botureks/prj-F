import { Field, InputType } from '@nestjs/graphql';
import { IsString, Length } from 'class-validator';

@InputType()
export class UpdatePostInput {
  @Field({ nullable: true })
  @IsString()
  @Length(1, 100)
  title?: string;

  @Field({ nullable: true })
  @IsString()
  content?: string;
}
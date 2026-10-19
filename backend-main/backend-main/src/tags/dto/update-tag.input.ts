import { Field, InputType } from '@nestjs/graphql';

import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength
} from 'class-validator';

@InputType()
export class UpdateTagInput {
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(30)
  name?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  color?: string;
}
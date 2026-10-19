import { IsString, Length } from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';

@InputType('SignIn')
export abstract class SignInDto {
  @Field(() => String)
  @IsString()
  @Length(5, 16)
  public username!: string;

  @Field(() => String)
  @IsString()
  @Length(5, 255)
  public password!: string;
}

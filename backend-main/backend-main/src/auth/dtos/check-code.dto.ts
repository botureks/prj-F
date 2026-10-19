import { IsEmail, IsString, Length } from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';

@InputType('CheckCode')
export abstract class CheckCodeDto {
  @Field(() => String)
  @IsString()
  @IsEmail(
    {},
    {
      message: 'Введите почту.'
    }
  )
  @Length(5, 255)
  public email!: string;

  @Field(() => String)
  @IsString()
  @Length(6)
  public code!: string;
}

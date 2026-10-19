import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreatePostDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  @Length(1, 32)
  topic: string;

  @IsNotEmpty()
  @IsString()
  content: string;
}
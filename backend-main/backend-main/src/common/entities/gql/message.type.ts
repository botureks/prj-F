import { Field, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';

@ObjectType('Message')
export class LocalMessageType {
  @ApiProperty({
    description: 'Message',
    example: 'Hello World',
    type: String
  })
  @Field(() => String)
  public message!: string;

  constructor(message: string) {
    this.message = message;
  }
}

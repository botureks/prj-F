import { Field, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IMessage } from '../../common/interfaces/message.interface';
import { UserEntity } from '../../users/entities/user.entity';

@ObjectType('AuthResponseType')
export class AuthResponseType implements IMessage {
  @ApiProperty({
    description: 'Message',
    example: 'Hello World',
    type: String
  })
  @Field(() => String)
  public message!: string;

  @Field(() => UserEntity, { nullable: true })
  user?: UserEntity;

  constructor(message: string, user?: UserEntity) {
    this.message = message;
    this.user = user;
  }
}

import { Field, ObjectType } from '@nestjs/graphql';

import { IMessage } from '../../common/interfaces/message.interface';

@ObjectType('SignInResponse')
export class SignInResponseType implements IMessage {
  @Field(() => String)
  public message!: string;

  constructor(error: string) {
    this.message = error;
  }
}

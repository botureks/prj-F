import { Field, ObjectType } from '@nestjs/graphql';

import { AuthResponseMapper } from '../mappers/auth-response.mapper';
import { SignInResponseType } from './sign-in-response.type';

@ObjectType('CheckCodeResponse')
export class CheckCodeResponseType {
  @Field(() => SignInResponseType, { nullable: true })
  signInResponse?: SignInResponseType;

  @Field(() => AuthResponseMapper, { nullable: true })
  authResponseMapper?: AuthResponseMapper;
}

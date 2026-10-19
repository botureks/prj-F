import { Field, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';

import { IAuthResponse } from '../interfaces/auth-response.interface';
import { IAuthResult } from '../interfaces/auth-result.interface';

import { AuthResponseUserMapper } from './auth-response-user.mapper';

@ObjectType('AuthResponseMapper')
export class AuthResponseMapper implements IAuthResponse {
  @Field(() => AuthResponseUserMapper)
  @ApiProperty({
    description: 'User',
    type: AuthResponseUserMapper
  })
  public user: AuthResponseUserMapper;

  @Field()
  @ApiProperty({
    description: 'Access token',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
    type: String
  })
  public accessToken: string;

  constructor(values: IAuthResponse) {
    Object.assign(this, values);
  }

  public static map(result: IAuthResult): AuthResponseMapper {
    return new AuthResponseMapper({
      user: AuthResponseUserMapper.map(result.user),
      accessToken: result.accessToken
    });
  }
}

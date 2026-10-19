import { Field, ObjectType } from '@nestjs/graphql';

import { IAuthResponseUser } from '../interfaces/auth-response-user.interface';

import { IUser } from '../../users/interfaces/user.interface';

@ObjectType('UserMapper')
export class AuthResponseUserMapper implements IAuthResponseUser {
  @Field()
  public id!: string;

  @Field(() => String)
  public username: string;

  constructor(values: IAuthResponseUser) {
    Object.assign(this, values);
  }

  public static map(user: IUser): AuthResponseUserMapper {
    return new AuthResponseUserMapper({
      id: user.id,
      username: user.username
    });
  }
}

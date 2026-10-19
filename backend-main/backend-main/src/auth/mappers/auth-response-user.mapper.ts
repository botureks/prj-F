import { Field, ObjectType } from '@nestjs/graphql';

import { IAuthResponseUser } from '../interfaces/auth-response-user.interface';

import { IUser } from '../../users/interfaces/user.interface';
import { UserRole } from '../../users/enums/user-role.enum';

@ObjectType('UserMapper')
export class AuthResponseUserMapper implements IAuthResponseUser {
  @Field()
  public id!: string;

  @Field(() => String)
  public username: string;

  @Field(() => UserRole)
  public role: UserRole;

  constructor(values: IAuthResponseUser) {
    Object.assign(this, values);
  }

  public static map(user: IUser): AuthResponseUserMapper {
    return new AuthResponseUserMapper({
      id: user.id,
      username: user.username,
      role: user.role
    });
  }
}

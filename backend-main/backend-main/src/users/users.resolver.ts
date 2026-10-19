import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { GraphQLUpload } from 'graphql-upload-minimal';

import { UserEntity } from './entities/user.entity';
import { UsersService } from './users.service';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { IFileData } from '../storage/intefaces/FileData.Interface';

@Resolver(() => UserEntity)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => UserEntity)
  public async profile(@CurrentUser() userId: string): Promise<UserEntity> {
    return await this.usersService.findOneById(userId);
  }

  @Mutation(() => UserEntity)
  async uploadAvatar(
    @CurrentUser() userId: string,
    @Args('file', { type: () => GraphQLUpload }) fileData: IFileData
  ): Promise<UserEntity> {
    return await this.usersService.uploadAvatar(userId, fileData);
  }
}

import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { GraphQLUpload } from 'graphql-upload-minimal';

import { UserEntity } from './entities/user.entity';
import { UsersService } from './users.service';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from './enums/user-role.enum';
import { UserProfileType } from './types/user-profile.type';
import { IFileData } from '../storage/intefaces/FileData.Interface';

@Resolver(() => UserEntity)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => UserEntity)
  public async profile(@CurrentUser() userId: string): Promise<UserEntity> {
    return await this.usersService.findOneById(userId);
  }

  @Public()
  @Query(() => UserProfileType)
  public async userProfile(@Args('id') id: string): Promise<UserProfileType> {
    return this.usersService.findProfileById(id);
  }

  @Mutation(() => UserProfileType)
  public async updateMyDescription(
    @CurrentUser() userId: string,
    @Args('description', { type: () => String, nullable: true })
    description?: string | null
  ): Promise<UserProfileType> {
    return this.usersService.updateMyDescription(userId, description);
  }

  @Roles(UserRole.ADMIN)
  @Query(() => [UserEntity])
  public async users(): Promise<UserEntity[]> {
    return this.usersService.getAllUsers();
  }

  @Roles(UserRole.ADMIN)
  @Mutation(() => UserEntity)
  public async blockUser(@Args('id') id: string): Promise<UserEntity> {
    return this.usersService.blockUser(id);
  }

  @Roles(UserRole.ADMIN)
  @Mutation(() => UserEntity)
  public async unblockUser(@Args('id') id: string): Promise<UserEntity> {
    return this.usersService.unblockUser(id);
  }

  @Mutation(() => UserEntity)
  async uploadAvatar(
    @CurrentUser() userId: string,
    @Args('file', { type: () => GraphQLUpload }) fileData: IFileData
  ): Promise<UserEntity> {
    return await this.usersService.uploadAvatar(userId, fileData);
  }
}
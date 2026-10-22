import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { GraphQLUpload } from 'graphql-upload-minimal';

import { StorageService } from './storage.service';
import { IFileData } from './intefaces/FileData.Interface';

@Resolver()
export class StorageResolver {
  constructor(private readonly storageService: StorageService) {}

  @Mutation(() => String)
  public async uploadContentImage(
    @Args('file', { type: () => GraphQLUpload }) file: IFileData
  ): Promise<string> {
    return this.storageService.uploadContentImage(file);
  }
}
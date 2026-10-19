import {
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';

import { hash } from 'bcrypt';
import { v4 } from 'uuid';

import { UserEntity } from './entities/user.entity';

import { CommonService } from '../common/common.service';
import { isNull, isUndefined } from '../common/utils/validation.util';

import { encrypt } from '../common/utils/encription.util';

import { IFileData } from '../storage/intefaces/FileData.Interface';
import { IRemoveSettings } from '../storage/intefaces/RemoveSettings.Interface';
import { IStorage } from '../config/interfaces/storage.interface';

import { AVATAR_SETTINGS } from '../storage/utils/StorageSettings';
import { StorageService } from '../storage/storage.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: EntityRepository<UserEntity>,
    private readonly commonService: CommonService,
    private readonly configService: ConfigService,
    @Inject(forwardRef(() => StorageService))
    private readonly storageService: StorageService
  ) {}

  public async create(username: string, password: string): Promise<UserEntity> {
    const existUser = await this.usersRepository.findOne({ username });
    if (existUser) {
      throw new InternalServerErrorException('Пользователь уже существует');
    }

    const user = this.usersRepository.create({
      id: v4(),
      username,
      password: await hash(password, 10)
    });

    await this.commonService.saveEntity(this.usersRepository, user, true);
    return user;
  }

  public async findOneById(id: string): Promise<UserEntity> {
    const user = await this.usersRepository.findOne({ id });
    this.throwUnauthorizedException(user);

    return user;
  }

  public async findOneByUsername(username: string): Promise<UserEntity> {
    const user = await this.usersRepository.findOne({ username });
    this.throwUnauthorizedException(user);

    return user;
  }

  public async findOneByCredentials(
    id: string,
    version: number
  ): Promise<UserEntity> {
    const user = await this.usersRepository.findOne({ id });
    this.throwUnauthorizedException(user);

    if (user.credentials.version !== version) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }

  public async uploadAvatar(
    userId: string,
    file: IFileData
  ): Promise<UserEntity> {
    const user = await this.findOneById(userId);
    const userOldIdHash = await encrypt(
      `${userId}_${user.credentials.pictureVersion}`
    );

    const removeSettings: IRemoveSettings = {
      bucket: AVATAR_SETTINGS.bucket,
      filename: `${userOldIdHash}.webp`
    };

    await this.storageService.removeFromS3(removeSettings);

    user.credentials.pictureVersion++;

    const userIdHash = await encrypt(
      `${userId}_${user.credentials.pictureVersion}`
    );

    const settings = AVATAR_SETTINGS;
    settings.filename = `${userIdHash}.webp`;

    const url = await this.storageService.uploadToS3(file, settings);

    const storage = this.configService.get<IStorage>('storage');
    user.picture = url.replace(storage.endpoint, storage.publicEndpoint);

    await this.commonService.saveEntity(this.usersRepository, user);

    return user;
  }

  private throwUnauthorizedException(
    user: undefined | null | UserEntity
  ): void {
    if (isUndefined(user) || isNull(user)) {
      throw new UnauthorizedException('Invalid credentials');
    }
  }
}

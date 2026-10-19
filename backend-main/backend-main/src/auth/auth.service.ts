import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';

import { CACHE_MANAGER } from '@nestjs/cache-manager';

import { compare } from 'bcrypt';
import { Cache } from 'cache-manager';

import dayjs from 'dayjs';

import { CommonService } from '../common/common.service';

import { isNull, isUndefined } from '../common/utils/validation.util';

import { UsersService } from '../users/users.service';

import { UserEntity } from '../users/entities/user.entity';

import { JwtService } from '../jwt/jwt.service';

import { TokenTypeEnum } from '../jwt/enums/token-type.enum';

import { IRefreshToken } from '../jwt/interfaces/refresh-token.interface';

import { IAuthResult } from './interfaces/auth-result.interface';
import { LocalMessageType } from '../common/entities/gql/message.type';

@Injectable()
export class AuthService {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
    private readonly commonService: CommonService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) {}

  public async signIn(
    username: string,
    password: string
  ): Promise<{
    jwt: [string, string];
    user: UserEntity;
  }> {
    const user = await this.usersService.findOneByUsername(username);

    const compareResult = await compare(password, user.password);

    if (!compareResult) {
      throw new UnauthorizedException();
    }

    const jwt = await this.jwtService.generateAuthTokens(user);

    return {
      jwt,
      user
    };
  }

  public async signUp(
    username: string,
    password: string
  ): Promise<{
    jwt: [string, string];
    user: UserEntity;
  }> {
    const user = await this.usersService.create(username, password);

    const jwt = await this.jwtService.generateAuthTokens(user);

    return {
      jwt,
      user
    };
  }

  public async logout(refreshToken: string): Promise<LocalMessageType> {
    const { id, tokenId, exp } =
      await this.jwtService.verifyToken<IRefreshToken>(
        refreshToken,
        TokenTypeEnum.REFRESH
      );

    await this.blacklistToken(id, tokenId, exp);

    return new LocalMessageType('Вы успешно вышли из аккаунта.');
  }

  public async refreshTokenAccess(refreshToken: string): Promise<IAuthResult> {
    const { id, version, tokenId } =
      await this.jwtService.verifyToken<IRefreshToken>(
        refreshToken,
        TokenTypeEnum.REFRESH
      );
    await this.checkIfTokenIsBlacklisted(id, tokenId);

    const user = await this.usersService.findOneByCredentials(id, version);

    return this.generateAuthResult(user, tokenId);
  }

  async checkIfTokenIsBlacklisted(
    userId: string,
    tokenId: string
  ): Promise<void> {
    const time = await this.cacheManager.get<number>(
      `blacklist:${userId}:${tokenId}`
    );

    if (!isUndefined(time) && !isNull(time)) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  private async blacklistToken(
    userId: string,
    tokenId: string,
    exp: number
  ): Promise<void> {
    const now = dayjs().unix();
    const ttl = (exp - now) * 1000;

    if (ttl > 0) {
      await this.commonService.throwInternalError(
        this.cacheManager.set(`blacklist:${userId}:${tokenId}`, now, ttl)
      );
    }
  }

  private async generateAuthResult(
    user: UserEntity,
    tokenId?: string
  ): Promise<IAuthResult> {
    const [accessToken, refreshToken] =
      await this.jwtService.generateAuthTokens(user, tokenId);

    return { user, accessToken, refreshToken };
  }
}

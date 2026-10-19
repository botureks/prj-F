import { UnauthorizedException } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ConfigService } from '@nestjs/config';

import { FastifyReply, FastifyRequest } from 'fastify';

import { SignInDto } from './dtos/sign-in.dto';

import { FastifyContext } from '../types/fastify.context';

import { AuthService } from './auth.service';

import { Public } from './decorators/public.decorator';

import { AuthResponseType } from './gql/auth-response.type';

import { isNull, isUndefined } from '../common/utils/validation.util';

import { AuthResponseMapper } from './mappers/auth-response.mapper';

@Resolver()
export class AuthResolver {
  static cookiePath = '/';
  static cookieName: string;
  static accessTime: number;
  static refreshTime: number;

  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService
  ) {
    AuthResolver.cookieName = this.configService.get<string>('REFRESH_COOKIE');
    AuthResolver.accessTime = this.configService.get<number>('jwt.access.time');
    AuthResolver.refreshTime =
      this.configService.get<number>('jwt.refresh.time');
  }

  @Public()
  @Mutation(() => AuthResponseType)
  public async signIn(
    @Context() ctx: FastifyContext,
    @Args('input') props: SignInDto
  ): Promise<AuthResponseType> {
    const { username, password } = props;

    const {
      jwt: [accessToken, refreshToken],
      user
    } = await this.authService.signIn(username, password);

    AuthResolver.saveTokens(ctx.reply, accessToken, refreshToken);

    return {
      message: 'Вы успешно авторизовались.',
      user
    };
  }

  @Public()
  @Mutation(() => AuthResponseType)
  public async signUp(
    @Context() ctx: FastifyContext,
    @Args('input') props: SignInDto
  ): Promise<AuthResponseType> {
    const { username, password } = props;

    const {
      jwt: [accessToken, refreshToken],
      user
    } = await this.authService.signUp(username, password);

    AuthResolver.saveTokens(ctx.reply, accessToken, refreshToken);

    return {
      message: 'Вы были успешно зарегистрированы.',
      user
    };
  }

  @Query(() => AuthResponseMapper)
  public async refreshAccess(
    @Context() ctx: FastifyContext
  ): Promise<AuthResponseMapper> {
    const token = AuthResolver.refreshTokenFromReq(ctx.reply.request);

    const result = await this.authService.refreshTokenAccess(token);

    AuthResolver.saveTokens(ctx.reply, result.accessToken, result.refreshToken);

    return AuthResponseMapper.map(result);
  }

  @Mutation(() => AuthResponseType)
  public async userLogout(
    @Context() ctx: FastifyContext
  ): Promise<AuthResponseType> {
    const token = AuthResolver.refreshTokenFromReq(ctx.reply.request);
    const response = await this.authService.logout(token);

    ctx.reply
      .clearCookie('session', { path: AuthResolver.cookiePath })
      .clearCookie(AuthResolver.cookieName, { path: AuthResolver.cookiePath });

    return new AuthResponseType(response.message);
  }

  public static saveTokens(
    res: FastifyReply,
    accessToken: string,
    refreshToken: string
  ): FastifyReply {
    return res
      .cookie('session', accessToken, {
        secure: true,
        httpOnly: true,
        signed: true,
        path: this.cookiePath,
        expires: new Date(Date.now() + this.accessTime * 1000)
      })
      .cookie(this.cookieName, refreshToken, {
        secure: true,
        httpOnly: true,
        signed: true,
        path: this.cookiePath,
        expires: new Date(Date.now() + this.refreshTime * 1000)
      });
  }

  public static refreshTokenFromReq(req: FastifyRequest): string {
    const token: string | undefined = req.cookies[AuthResolver.cookieName];

    if (isUndefined(token) || isNull(token)) {
      throw new UnauthorizedException();
    }

    const { valid, value } = req.unsignCookie(token);

    if (!valid) {
      throw new UnauthorizedException();
    }

    return value;
  }
}

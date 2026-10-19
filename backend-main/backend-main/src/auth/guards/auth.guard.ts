import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';

import { FastifyReply, FastifyRequest } from 'fastify';

import { isJWT, isString } from 'class-validator';

import { TokenTypeEnum } from '../../jwt/enums/token-type.enum';
import { JwtService } from '../../jwt/jwt.service';
import { IAccessToken } from '../../jwt/interfaces/access-token.interface';

import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

import { AuthService } from '../auth.service';
import { AuthResolver } from '../auth.resolver';

import { isNull, isUndefined } from '../../common/utils/validation.util';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
    private readonly authService: AuthService
  ) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass()
    ]);

    const request = this.getRequest(context);
    const reply = this.getReply(context);

    const activate = await this.setAuthContext(request, reply, isPublic);

    if (!activate) {
      throw new UnauthorizedException();
    }

    return activate;
  }

  private getRequest(context: ExecutionContext): FastifyRequest {
    if (context.getType<GqlContextType>() === 'graphql') {
      return GqlExecutionContext.create(context).getContext().request;
    }

    return context.switchToHttp().getRequest<FastifyRequest>();
  }

  private getReply(context: ExecutionContext): FastifyReply {
    if (context.getType<GqlContextType>() === 'graphql') {
      return GqlExecutionContext.create(context).getContext().reply;
    }

    return context.switchToHttp().getResponse<FastifyReply>();
  }

  private async setAuthContext(
    req: FastifyRequest,
    reply: FastifyReply,
    isPublic: boolean
  ): Promise<boolean> {
    try {
      const cookies = req.cookies;

      let sessionCookie = null;
      if (isString(cookies['session'])) {
        const { value, valid } = req.unsignCookie(cookies['session']);

        if (valid) {
          sessionCookie = value;
        }
      }

      if (
        isUndefined(sessionCookie) ||
        isNull(sessionCookie) ||
        !isJWT(sessionCookie)
      ) {
        const result = await this.authService.refreshTokenAccess(
          AuthResolver.refreshTokenFromReq(req)
        );

        AuthResolver.saveTokens(reply, result.accessToken, result.refreshToken);
        sessionCookie = result.accessToken;
      }

      const { id } = await this.jwtService.verifyToken<IAccessToken>(
        sessionCookie,
        TokenTypeEnum.ACCESS
      );
      const user = await this.authService.validateAccessUser(id);

      req.user = user.id;
      req.userRole = user.role;

      return true;
    } catch (e) {
      console.error(e);
      return isPublic;
    }
  }
}

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

    if (context.getType<GqlContextType>() === 'graphql') {
      const gqlCtx = GqlExecutionContext.create(context);

      const args = gqlCtx.getArgByIndex(2);
      const ctx = {
        ...args?.req,
        ...args?.res,
        switchToHttp() {
          const getRequest = () => {
            return args?.req;
          };
          const getResponse = () => {
            return args?.res;
          };

          return { getRequest, getResponse };
        }
      };

      const activate = await this.setHttpHeader(
        ctx.switchToHttp().getRequest(),
        gqlCtx.getContext().reply,
        isPublic
      );

      if (!activate) {
        throw new UnauthorizedException();
      }

      return activate;
    }

    if (context.getType() === 'http') {
      const activate = await this.setHttpHeader(
        context.switchToHttp().getRequest<FastifyRequest>(),
        context.switchToHttp().getResponse(),
        isPublic
      );

      if (!activate) {
        throw new UnauthorizedException();
      }

      return activate;
    }

    return false;
  }

  private async setHttpHeader(
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

      const { id } = await this.jwtService.verifyToken(
        sessionCookie,
        TokenTypeEnum.ACCESS
      );

      req.user = id;
      return true;
    } catch (e) {
      console.error(e);
      return isPublic;
    }
  }
}

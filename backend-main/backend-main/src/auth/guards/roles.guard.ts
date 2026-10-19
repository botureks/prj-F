import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';
import { FastifyRequest } from 'fastify';

import { ROLES_KEY } from '../decorators/roles.decorator';
import { UserRole } from '../../users/enums/user-role.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  public canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()]
    );

    if (!requiredRoles?.length) {
      return true;
    }

    const request = this.getRequest(context);

    if (!request.userRole || !requiredRoles.includes(request.userRole)) {
      throw new ForbiddenException('Недостаточно прав');
    }

    return true;
  }

  private getRequest(context: ExecutionContext): FastifyRequest {
    if (context.getType<GqlContextType>() === 'graphql') {
      return GqlExecutionContext.create(context).getContext().request;
    }

    return context.switchToHttp().getRequest<FastifyRequest>();
  }
}
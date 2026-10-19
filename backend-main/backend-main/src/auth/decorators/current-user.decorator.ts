import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';

export const CurrentUser = createParamDecorator(
  (_, context: ExecutionContext): string | undefined => {
    if (context.getType<GqlContextType>() === 'graphql') {
      const ex_ctx = GqlExecutionContext.create(context);

      const args = ex_ctx.getArgByIndex(2);
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

      return ctx.switchToHttp().getRequest()?.user;
    }

    return context.switchToHttp().getRequest<FastifyRequest>()?.user;
  }
);

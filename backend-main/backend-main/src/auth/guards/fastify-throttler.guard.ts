import { ExecutionContext, Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';

import { FastifyReply, FastifyRequest } from 'fastify';

import { IFastifyExpress } from '../interfaces/fastify-express.interface';

@Injectable()
export class FastifyThrottlerGuard extends ThrottlerGuard {
  public getRequestResponse(context: ExecutionContext): IFastifyExpress {
    const http = context.switchToHttp();

    return {
      req: http.getRequest<FastifyRequest>(),
      res: http.getResponse<FastifyReply>()
    };
  }
}

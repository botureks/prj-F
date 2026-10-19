import { FastifyReply, FastifyRequest } from 'fastify';

export interface IFastifyExpress {
  readonly req: FastifyRequest;
  readonly res: FastifyReply;
}

import { FastifyReply } from 'fastify';

export interface FastifyContext {
  reply: FastifyReply;
}

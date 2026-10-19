import { FastifyReply, FastifyRequest as Request } from 'fastify';

declare module 'fastify' {
  interface FastifyRequest extends Request {
    user?: string;
    sessionId?: string;
    cookies: [];
    multipart(handler: any, onEnd: any);
    unsignCookie(token: string);
  }

  interface Reply extends FastifyReply {
    clearCookie(name: string, options: { path: string });
    cookie(
      name: string,
      token: string,
      options: {
        secure: boolean;
        httpOnly: boolean;
        signed: boolean;
        path: string;
        expires: Date;
      }
    );
    status(code: number);
    redirect(url: string);
    sendFile(path: string);
  }
}

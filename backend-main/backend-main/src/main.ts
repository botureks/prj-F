import fastifyCookie from '@fastify/cookie';
import fastifyCors from '@fastify/cors';
import fastifyCsrfProtection from '@fastify/csrf-protection';
import fastifyHelmet from '@fastify/helmet';

import mercuriusUpload from 'mercurius-upload';

import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication
} from '@nestjs/platform-fastify';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter()
  );
  const configService = app.get(ConfigService);

  // @ts-expect-error
  await app.register(fastifyCookie, {
    secret: configService.get<string>('COOKIE_SECRET')
  });

  // @ts-expect-error
  await app.register(fastifyHelmet);

  // @ts-expect-error
  await app.register(fastifyCsrfProtection, { cookieOpts: { signed: true } });

  // @ts-expect-error
  await app.register(fastifyCors, {
    credentials: true,
    origin: process.env.CORS_ORIGIN || `https://${configService.get<string>('domain')}`
  });

  // @ts-ignore
  app.register(mercuriusUpload, configService.get('upload'));

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true
    })
  );

  console.log(configService.get<number>('port'), 'PORT');

  await app.listen(
    configService.get<number>('port'),
    configService.get<boolean>('testing') ? '127.0.0.1' : '0.0.0.0'
  );
}

bootstrap();

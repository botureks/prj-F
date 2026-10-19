import { APP_GUARD } from '@nestjs/core';
import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { MercuriusDriver } from '@nestjs/mercurius';
import { CacheModule } from '@nestjs/cache-manager';

import { MikroOrmModule } from '@mikro-orm/nestjs';

import { MikroOrmConfig } from './config/mikro-orm.config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { JwtModule } from './jwt/jwt.module';

import { config } from './config';
import { validationSchema } from './config/schemas/config.schema';
import { GqlConfigService } from './config/graphql.config';
import { CacheConfig } from './config/cache.config';

import { AuthGuard } from './auth/guards/auth.guard';
import { AuthService } from './auth/auth.service';

import { PostsModule } from './posts/posts.module';

import { CommentsModule } from './comments/comments.module';
import { TagsModule } from './tags/tags.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema,
      load: [config]
    }),
    MikroOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: MikroOrmConfig
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      useClass: CacheConfig
    }),
    GraphQLModule.forRootAsync({
      imports: [ConfigModule, JwtModule],
      driver: MercuriusDriver,
      useClass: GqlConfigService
    }),
    CommonModule,
    forwardRef(() => AuthModule),
    forwardRef(() => UsersModule),
    JwtModule,
    PostsModule,
    CommentsModule,
    TagsModule
  ],
  providers: [
    AuthService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard
    }
  ]
})
export class AppModule {}
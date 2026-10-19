import { Injectable } from '@nestjs/common';
import { GqlOptionsFactory } from '@nestjs/graphql';
import { MercuriusDriverConfig } from '@nestjs/mercurius';

@Injectable()
export class GqlConfigService implements GqlOptionsFactory<MercuriusDriverConfig> {
  public createGqlOptions(): MercuriusDriverConfig {
    return {
      graphiql: true,
      ide: true,
      path: '/api/graphql',
      routes: true,
      autoSchemaFile: './schema.gql',
      context: (request: any, reply: any) => ({ request, reply }),
    };
  }
}
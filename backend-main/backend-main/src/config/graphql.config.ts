import { Injectable } from '@nestjs/common';
import { GqlOptionsFactory } from '@nestjs/graphql';
import { MercuriusDriverConfig } from '@nestjs/mercurius';

@Injectable()
export class GqlConfigService
  implements GqlOptionsFactory<MercuriusDriverConfig>
{
  public createGqlOptions(): MercuriusDriverConfig {
    // @ts-ignore
    return {
      graphiql: false,
      ide: false,
      path: '/api/graphql',
      routes: true,
      autoSchemaFile: './schema.gql',
      // @ts-ignore
      context: ({ request, reply }) => ({ request, reply })
    };
  }
}
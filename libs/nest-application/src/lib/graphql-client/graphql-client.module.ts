import { Module } from '@nestjs/common';
import { GraphqlClientService } from './graphql-client.service';

@Module({
  providers: [GraphqlClientService],
  exports: [GraphqlClientService],
})
export class GraphqlClientModule {}

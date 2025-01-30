import {  Inject, Injectable } from '@nestjs/common';
import { IpcMessageListener } from '@electron-nx/nestjs-ipc';
import { GraphqlClientService } from '../graphql-client/graphql-client.service';

@Injectable()
export class IpcService {

  constructor(@Inject(GraphqlClientService) private graphql: GraphqlClientService) {}

  @IpcMessageListener('getTransactions')
  async getTransactions(nextToken: string | null) {
    return this.graphql.getTransactions(nextToken)
  }
}

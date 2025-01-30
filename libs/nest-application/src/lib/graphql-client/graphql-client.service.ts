import {  Injectable, OnModuleInit } from '@nestjs/common';
import { IpcMessageListener } from '@electron-nx/nestjs-ipc';
import { cacheExchange, Client, fetchExchange } from 'urql';
import { PagedResponse, UITransaction } from '@electron-nx/prerender-api';
import { LatestTransactionsDocument, LatestTransactionsQuery } from './generated/transactions';

const apiServiceUrl = process.env['VITE_API_SERVICE_URL'] || '';

export const createClient = (): Client => {
  const client = new Client({
    url: `${apiServiceUrl}/graphql`,
    exchanges: [cacheExchange, fetchExchange],
    suspense: true,
  });
  return client;
};
@Injectable()
export class GraphqlClientService implements OnModuleInit {
  client?: Client

  onModuleInit() {
    this.client = createClient();   
  }

  async getTransactions(
    nextToken: string | null,
  ): Promise<PagedResponse<UITransaction[]>> {
    if (!this.client) throw Error('no client');
    const { data } = await this.client.query<LatestTransactionsQuery>(
      LatestTransactionsDocument,
      {
        nextToken,
        limit: 50,
      },
    );
    const transactions = data?.latestTransactions?.data || [];
    return {
      data: data?.latestTransactions?.data || [],
      meta: {
        count: transactions.length,
        nextToken: data?.latestTransactions?.meta.nextToken || undefined,
      },
    };
  };
  
}

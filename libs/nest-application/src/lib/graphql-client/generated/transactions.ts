import gql from 'graphql-tag';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type Currency = {
  __typename?: 'Currency';
  code: Scalars['String']['output'];
};

export type PagedTransactions = {
  __typename?: 'PagedTransactions';
  data: Array<Transaction>;
  meta: PagingMeta;
};

export type PagingMeta = {
  __typename?: 'PagingMeta';
  count: Scalars['Int']['output'];
  nextToken?: Maybe<Scalars['String']['output']>;
};

export type Query = {
  __typename?: 'Query';
  latestTransactions?: Maybe<PagedTransactions>;
  transactions?: Maybe<PagedTransactions>;
};


export type QueryLatestTransactionsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  nextToken?: InputMaybe<Scalars['String']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
};


export type QueryTransactionsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  nextToken?: InputMaybe<Scalars['String']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
};

export type Transaction = {
  __typename?: 'Transaction';
  amount: Scalars['Int']['output'];
  code: Scalars['String']['output'];
  createdAt: Scalars['String']['output'];
  currency: Currency;
  id: Scalars['String']['output'];
  routingNumber: Scalars['String']['output'];
  transactionDate: Scalars['String']['output'];
  transactionDescription: Scalars['String']['output'];
  transactionType: Scalars['String']['output'];
  trxId: Scalars['String']['output'];
  updatedAt: Scalars['String']['output'];
};

export type LatestTransactionsQueryVariables = Exact<{
  limit?: InputMaybe<Scalars['Int']['input']>;
  nextToken?: InputMaybe<Scalars['String']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
}>;


export type LatestTransactionsQuery = { __typename?: 'Query', latestTransactions?: { __typename?: 'PagedTransactions', meta: { __typename?: 'PagingMeta', nextToken?: string | null, count: number }, data: Array<{ __typename?: 'Transaction', trxId: string, transactionType: string, transactionDescription: string, transactionDate: string, createdAt: string, updatedAt: string }> } | null };


export const LatestTransactionsDocument = gql`
    query LatestTransactions($limit: Int, $nextToken: String, $search: String) {
  latestTransactions(limit: $limit, nextToken: $nextToken, search: $search) {
    meta {
      nextToken
      count
    }
    data {
      trxId
      transactionType
      transactionDescription
      transactionDate
      createdAt
      updatedAt
    }
  }
}
    `;
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Handler, useWebsocket } from './useWebsocket';

import { UITransaction } from './transactions-view';

type AddTransactions = (...t: UITransaction[]) => void;

type LoadMore = () => void;

const useTransactionsQuery = (
  addTransactions: AddTransactions,
): { loadMore: LoadMore; hasMore: boolean; isLoading: boolean } => {
  const initialLoadDone = useRef<boolean>(false);
  const [nextToken, setNextToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const getTransactions = useCallback(async () => {
    setIsLoading(true);
    const {
      data,
      meta: { nextToken: newNextToken },
    } = await window.api.getTransactions(nextToken);
    addTransactions(...data);
    setNextToken(newNextToken || null);
    setIsLoading(false);
  }, [nextToken]);

  useEffect(() => {
    if (initialLoadDone.current) return;
    initialLoadDone.current = true;
    void getTransactions();
  }, [getTransactions]);

  return { loadMore: getTransactions, hasMore: nextToken !== null, isLoading };
};

const useTransactionsStore = (): [UITransaction[], AddTransactions] => {
  const [transactions, setTransactions] = useState<UITransaction[]>([]);

  const addTransactions = useCallback<AddTransactions>(
    (...transactions: UITransaction[]) => {
      setTransactions((t) => t.concat(transactions));
    },
    [],
  );
  return [transactions, addTransactions];
};

const useTransactionsWebsocketConfig = (addTransactions: AddTransactions) => {
  const onNewTransaction = useCallback(
    (trx: UITransaction) => {
      addTransactions(trx);
    },
    [addTransactions],
  ) as Handler;
  const config = useMemo(
    () => ({
      rooms: ['transactions'],
      handlers: {
        newTransaction: onNewTransaction,
      },
    }),
    [onNewTransaction],
  );
  const { connected } = useWebsocket(config);

  return { connected };
};

export const useTransactionsData = () => {
  const [transactions, addTransactions] = useTransactionsStore();
  const { connected } = useTransactionsWebsocketConfig(addTransactions);
  const { loadMore, hasMore, isLoading } =
    useTransactionsQuery(addTransactions);
  return { connected, transactions, loadMore, hasMore, isLoading };
};

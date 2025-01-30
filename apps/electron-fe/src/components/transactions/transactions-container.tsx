import { TransactionsView } from './transactions-view';
import { useTransactionsData } from './useTransactionsData';

export const TransactionsContainer = () => {
  const { connected, transactions, loadMore, hasMore, isLoading } =
    useTransactionsData();

  return (
    <div>
      <TransactionsView
        transactions={transactions}
        loadMore={loadMore}
        isLoading={isLoading}
        hasMore={hasMore}
        isLive={connected}
      />
    </div>
  );
};

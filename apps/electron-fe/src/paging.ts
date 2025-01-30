import { Virtualizer } from '@tanstack/react-virtual';
import { useEffect, useMemo } from 'react';
import debounce from 'lodash.debounce';

export const useInfiniteScroll = <T>({
  virtualizer,
  data,
  loadMore,
  hasMore,
  threshold,
}: {
  virtualizer: Virtualizer<HTMLDivElement, Element>;
  data: T[];
  loadMore: () => void;
  hasMore: boolean;
  threshold: number;
}) => {
  const debouncedLoadMore = useMemo(() => debounce(loadMore, 1000), [loadMore]);
  const virtualItems = virtualizer.getVirtualItems();
  const delta = useMemo(() => {
    if (!virtualItems.length) return null;
    return (virtualItems[virtualItems.length - 1].index + 1) / data.length;
  }, [virtualItems, data]);

  useEffect(() => {
    if (delta === null || !hasMore || delta < threshold) {
      return;
    }
    debouncedLoadMore();
  }, [delta, hasMore, debouncedLoadMore, threshold]);
};

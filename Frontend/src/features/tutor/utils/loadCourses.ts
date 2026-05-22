import { useMemo, useState, useCallback } from "react";

interface UseBatchOptions {
  initialCount?: number;
  step?: number;
  max?: number;
}

export function useBatch<T>(
  items: T[],
  options: UseBatchOptions = {}
) {
  const {
    initialCount = 5,
    step = 5,
    max,
  } = options;

  const [count, setCount] = useState(initialCount);

  // reset when items change (important for dynamic lists)
  const reset = useCallback(() => {
    setCount(initialCount);
  }, [initialCount]);

  const loadMore = useCallback(() => {
    setCount((prev) => {
      const limit = max ?? items.length;
      return Math.min(prev + step, limit);
    });
  }, [items.length, step, max]);

  const canLoadMore = count < (max ?? items.length);

  const visibleItems = useMemo(() => {
    return items.slice(0, count);
  }, [items, count]);

  return {
    visibleItems,
    count,
    loadMore,
    reset,
    canLoadMore,
    setCount,
  };
}
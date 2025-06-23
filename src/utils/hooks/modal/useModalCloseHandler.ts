import { useCallback } from 'react';

export function useModalCloseHandler<T>(setValue: (value: T | null) => void) {
  return useCallback(
    (open: boolean) => {
      if (!open) setValue(null);
    },
    [setValue]
  );
}

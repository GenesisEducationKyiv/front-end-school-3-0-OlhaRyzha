import { useCallback } from 'react';

export function useModalCloseHandler(closeFn: () => void) {
  return useCallback(
    (open: boolean) => {
      if (!open) closeFn();
    },
    [closeFn]
  );
}

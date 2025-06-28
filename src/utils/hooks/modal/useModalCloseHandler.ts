export function useModalCloseHandler(closeFn: () => void) {
  return (open: boolean) => {
    if (!open) closeFn();
  };
}

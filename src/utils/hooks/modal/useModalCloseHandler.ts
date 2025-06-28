export function useModalCloseHandler(closeFn: () => void) {
  const handleToggle = (open: boolean) => {
    if (!open) closeFn();
  };

  return handleToggle;
}

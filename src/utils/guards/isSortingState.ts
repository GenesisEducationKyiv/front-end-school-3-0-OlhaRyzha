import { SortingState } from '@tanstack/react-table';

export function isSortingState(value: unknown): value is SortingState {
  return Array.isArray(value);
}

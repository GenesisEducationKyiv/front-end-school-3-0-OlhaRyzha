import { vi } from 'vitest';

const safeFetchImpl = vi.fn();
const fetchVoidImpl = vi.fn();

vi.mock('@/utils/safeFetch', () => ({
  safeFetch: safeFetchImpl,
  fetchVoidResponse: fetchVoidImpl,
}));

export { safeFetchImpl, fetchVoidImpl };

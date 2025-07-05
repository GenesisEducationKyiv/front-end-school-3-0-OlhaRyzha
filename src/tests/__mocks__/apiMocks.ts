import { vi } from 'vitest';

const get = vi.fn().mockResolvedValue('mocked-get');
const post = vi.fn().mockResolvedValue('mocked-post');
const put = vi.fn().mockResolvedValue('mocked-put');
const del = vi.fn().mockResolvedValue('mocked-delete');

vi.mock('@/services/BaseService', () => ({
  default: { get, post, put, delete: del },
}));

export { get, post, put, del };

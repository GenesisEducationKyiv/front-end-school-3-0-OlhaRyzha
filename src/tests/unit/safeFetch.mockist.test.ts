import { test, expect, vi } from 'vitest';
import * as toastModule from '@/utils/hooks/use-toast';
import { trackSchema } from '@/schemas/track.schemas';
import { safeFetch } from '@/utils/safeFetch';
import { mockTrack } from '../__mocks__/mockTrack';

vi.spyOn(toastModule, 'toast').mockImplementation(() => ({
  id: 'mock-toast-id',
  dismiss: vi.fn(),
  update: vi.fn(),
}));

test('should return parsed data from API (valid)', async () => {
  const api = vi.fn().mockResolvedValue(mockTrack);
  const result = await safeFetch(api(), trackSchema);
  expect(result).toEqual(mockTrack);
});

test('should throw error and call toast if API returns invalid data', async () => {
  const api = vi.fn().mockResolvedValue({ id: 123 });
  await expect(safeFetch(api(), trackSchema)).rejects.toThrow();
  expect(toastModule.toast).toHaveBeenCalled();
});

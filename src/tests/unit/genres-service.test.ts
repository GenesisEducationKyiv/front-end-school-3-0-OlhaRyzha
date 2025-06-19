import { test, expect, vi, Mock } from 'vitest';
import { API_ROUTES } from '@/constants/api.constant';
import apiClient from '@/services/BaseService';
import { safeFetch } from '@/utils/safeFetch';
import { genresSchema } from '@/schemas/genres.schemas';
import { GenresService } from '@/services';

vi.mock('@/services/BaseService', () => {
  return {
    default: {
      get: vi.fn().mockImplementation(() => Promise.resolve('mocked-get')),
    },
  };
});

vi.mock('@/utils/safeFetch', () => {
  return {
    safeFetch: vi.fn(),
  };
});

test('GenresService.getAll should call apiClient.get and validate response', async () => {
  const mockGenres = ['Rock', 'Pop'];
  (safeFetch as Mock).mockResolvedValue(mockGenres);

  const result = await GenresService.getAll();

  expect(apiClient.get).toHaveBeenCalledWith(API_ROUTES.GENRES);
  expect(safeFetch).toHaveBeenCalledWith(expect.any(Promise), genresSchema);
  expect(result).toEqual(mockGenres);
});

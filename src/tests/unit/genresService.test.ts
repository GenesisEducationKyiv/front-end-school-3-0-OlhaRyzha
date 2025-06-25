import '../__mocks__/apiMocks';
import { safeFetchImpl } from '../__mocks__/safeFetchMock';
import { test, expect } from 'vitest';
import { API_ROUTES } from '@/constants/api.constant';
import apiClient from '@/services/BaseService';
import { safeFetch } from '@/utils/safeFetch';
import { genresSchema } from '@/schemas/genres.schemas';
import { GenresService } from '@/services';

test('GenresService.getAll should call apiClient.get and validate response', async () => {
  const mockGenres = ['Rock', 'Pop'];
  safeFetchImpl.mockResolvedValue(mockGenres);

  const result = await GenresService.getAll();

  expect(apiClient.get).toHaveBeenCalledWith(API_ROUTES.GENRES);
  expect(safeFetch).toHaveBeenCalledWith(expect.any(Promise), genresSchema);
  expect(result).toEqual(mockGenres);
});

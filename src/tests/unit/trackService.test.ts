import '../__mocks__/apiMocks';
import { safeFetchImpl, fetchVoidImpl } from '../__mocks__/safeFetchMock';
import { describe, test, expect } from 'vitest';
import { API_ROUTES } from '@/constants/api.constant';
import apiClient from '@/services/BaseService';
import { ACTIONS } from '@/constants/actions.constants';
import { safeFetch } from '@/utils/safeFetch';
import { TrackService } from '@/services';
import { mockTrack } from '../__mocks__/mockTrack';
import { z } from 'zod';

describe('TrackService', () => {
  const trackId = '123';
  const params = { page: 1, limit: 10 };

  test('getAll should call apiClient.get with correct params and validate response', async () => {
    const mockResponse = {
      data: [mockTrack],
      meta: { total: 1, page: 1, limit: 10 },
    };
    safeFetchImpl.mockResolvedValue(mockResponse);

    const result = await TrackService.getAll(params);

    expect(apiClient.get).toHaveBeenCalledWith(API_ROUTES.TRACKS, { params });

    expect(safeFetch).toHaveBeenCalledTimes(1);
    const [promiseArg, zodArg] = safeFetchImpl.mock.calls[0];
    expect(promiseArg).toBeInstanceOf(Promise);
    expect(zodArg).toBeInstanceOf(z.ZodObject);
    expect(result).toEqual(mockResponse);
  });

  test('getTrackBySlug should call apiClient.get with slug and validate response', async () => {
    safeFetchImpl.mockResolvedValue(mockTrack);

    const result = await TrackService.getTrackBySlug('test-slug');

    expect(apiClient.get).toHaveBeenCalledWith(
      `${API_ROUTES.TRACKS}/test-slug`
    );
    expect(result).toEqual(mockTrack);
  });

  test('create should call apiClient.post and validate response', async () => {
    safeFetchImpl.mockResolvedValue(mockTrack);

    const dto = { ...mockTrack };
    const result = await TrackService.create(dto);

    expect(apiClient.post).toHaveBeenCalledWith(API_ROUTES.TRACKS, dto);
    expect(result).toEqual(mockTrack);
  });

  test('update should call apiClient.put with id and payload', async () => {
    safeFetchImpl.mockResolvedValue(mockTrack);
    const payload = { ...mockTrack };

    const result = await TrackService.update(trackId, payload);
    expect(apiClient.put).toHaveBeenCalledWith(
      `${API_ROUTES.TRACKS}/${trackId}`,
      payload
    );
    expect(result).toEqual(mockTrack);
  });

  test('delete should call apiClient.delete and validate void response', async () => {
    fetchVoidImpl.mockResolvedValue({});

    const result = await TrackService.delete(trackId);
    expect(apiClient.delete).toHaveBeenCalledWith(
      `${API_ROUTES.TRACKS}/${trackId}`
    );
    expect(result).toEqual({});
  });

  test('bulkDelete should call apiClient.post and validate response', async () => {
    const response = { deletedCount: 1 };
    safeFetchImpl.mockResolvedValue(response);

    const result = await TrackService.bulkDelete([trackId]);

    expect(apiClient.post).toHaveBeenCalledWith(
      `${API_ROUTES.TRACKS}/${ACTIONS.DELETE}`,
      { ids: [trackId] }
    );
    expect(result).toEqual(response);
  });

  test('uploadAudio should call apiClient.post with formData and headers', async () => {
    const file = new File(['dummy'], 'track.mp3', { type: 'audio/mp3' });
    safeFetchImpl.mockResolvedValue(mockTrack);

    const result = await TrackService.uploadAudio(trackId, file);

    expect(apiClient.post).toHaveBeenCalledWith(
      `${API_ROUTES.TRACKS}/${trackId}/${ACTIONS.UPLOAD}`,
      expect.any(FormData),
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    expect(result).toEqual(mockTrack);
  });

  test('deleteAudio should call apiClient.delete with correct path and validate response', async () => {
    safeFetchImpl.mockResolvedValue(mockTrack);

    const result = await TrackService.deleteAudio(trackId);

    expect(apiClient.delete).toHaveBeenCalledWith(
      `${API_ROUTES.TRACKS}/${trackId}/${API_ROUTES.FILE}`
    );
    expect(result).toEqual(mockTrack);
  });
});

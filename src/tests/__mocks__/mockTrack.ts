import { type Track, type CreateTrackDto } from '@/types/shared/track';

export const baseMockTrack: Track = {
  id: '123',
  title: 'Test Track',
  artist: 'Test Artist',
  album: '',
  coverImage: '',
  audioFile: '',
  genres: [],
  slug: 'test-track',
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-02T00:00:00.000Z',
};

export const mockTrack: Track = { ...baseMockTrack };

export const mockExistingTrack: Track = {
  ...baseMockTrack,
  title: 'Old Title',
  artist: 'Old Artist',
  album: 'Some Album',
  slug: 'old-title',
  genres: ['Jazz'],
  createdAt: '2025-01-01T00:00:00.000Z',
  updatedAt: '2025-01-02T00:00:00.000Z',
};

export const createTrackDtoMock: CreateTrackDto = {
  title: 'New Track',
  artist: 'New Artist',
  album: '',
  genres: ['Rock'],
  coverImage: '',
};

export const DUPLICATE_TITLE_ERROR = {
  message: 'A track with this title already exists',
  status: 409,
};

export const GENERIC_SERVER_ERROR = {
  message: 'Server Error',
  status: 500,
};

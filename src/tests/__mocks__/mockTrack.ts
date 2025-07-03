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

export const invalidTrackMock = {
  id: '123',
  // missing title
  artist: '',
  album: '',
  genres: [],
  slug: '',
  createdAt: '',
  updatedAt: '',
};

export const apiErrorResponse = {
  status: 500,
  message: 'Server Error',
};

export const DUPLICATE_TITLE_ERROR = {
  message: 'A track with this title already exists',
  userMessage: 'A track with this title already exists',
};

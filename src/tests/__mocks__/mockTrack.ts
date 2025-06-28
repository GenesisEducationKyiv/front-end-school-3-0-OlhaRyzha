export default 'test-file-stub';

export const baseMockTrack = {
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

export const mockTrack = {
  ...baseMockTrack,
};

export const mockExistingTrack = {
  ...baseMockTrack,
  title: 'Old Title',
  artist: 'Old Artist',
  album: 'Some Album',
  slug: 'old-title',
  genres: ['Jazz'],
  createdAt: '2025-01-01T00:00:00Z',
  updatedAt: '2025-01-02T00:00:00Z',
};

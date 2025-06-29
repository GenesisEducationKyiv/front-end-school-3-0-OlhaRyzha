export const META = {
  page: 1,
  limit: 10,
  sort: 'createdAt',
  order: 'desc',
  total: 0,
} as const;

export const TABLE_SIZES = [10, 20, 30, 40, 50];

export const TRACKS_LIST_KEY = 'tracks';

export const ALL_TRACKS_KEY = 'all_tracks';

export const TRACK_KEY = 'track';

export const FILE_KEY = 'file';

export const PARAMS = {
  PAGE: 'page',
  LIMIT: 'limit',
  SORT: 'sort',
  ORDER: 'order',
  GENRE: 'genre',
  ARTIST: 'artist',
  SEARCH: 'search',
} as const;

export const DEFAULT_TABLE_COLUMN = {
  size: 150,
  minSize: 100,
};

import { META } from '@/constants/table.constants';
import { QueryParams } from '@/types/shared/track';
import { ALL_ARTISTS, ALL_GENRES } from '@/constants/labels.constant';
import { GenresType } from '@/types/shared/genre';
import { ArtistsType } from '@/types/shared/artists';

export const initialParams: QueryParams = {
  page: META.page,
  limit: META.limit,
  search: '',
  sort: META.sort,
  order: META.order,
  genre: '',
  artist: '',
};

export function getFiltersConfig(
  params: QueryParams,
  availableArtists: ArtistsType,
  availableGenres: GenresType,
  onArtistChange: (v: string) => void,
  onGenreChange: (v: string) => void
) {
  return [
    {
      value: params.artist ?? ALL_ARTISTS,
      onChange: onArtistChange,
      testid: 'filter-artist',
      placeholder: 'Filter by artist',
      availableOptions: availableArtists,
      selectedItem: ALL_ARTISTS,
    },
    {
      value: params.genre ?? ALL_GENRES,
      onChange: onGenreChange,
      testid: 'filter-genre',
      placeholder: 'Filter by genre',
      availableOptions: availableGenres,
      selectedItem: ALL_GENRES,
    },
  ];
}

import { QueryParams } from '@/types/shared/track';
import { ALL_ARTISTS, ALL_GENRES } from '@/constants/labels.constant';
import { GenresType } from '@/types/shared/genre';
import { ArtistsType } from '@/types/shared/artists';
import { getArtistValue } from '@/utils/table/filters/getArtistValue';
import { getGenreValue } from '@/utils/table/filters/getGenreValue';

export function getFiltersConfig(
  params: QueryParams,
  availableArtists: ArtistsType,
  availableGenres: GenresType,
  onArtistChange: (v: string) => void,
  onGenreChange: (v: string) => void
) {
  return [
    {
      value: getArtistValue(params.artist),
      onChange: onArtistChange,
      testid: 'filter-artist',
      placeholder: 'Filter by artist',
      availableOptions: availableArtists,
      selectedItem: ALL_ARTISTS,
    },
    {
      value: getGenreValue(params.genre),
      onChange: onGenreChange,
      testid: 'filter-genre',
      placeholder: 'Filter by genre',
      availableOptions: availableGenres,
      selectedItem: ALL_GENRES,
    },
  ];
}

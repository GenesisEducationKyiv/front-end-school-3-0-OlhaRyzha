import { ALL_ARTISTS, ALL_GENRES } from '@/constants/labels.constant';
import { GenresType } from '@/types/shared/genre';
import { ArtistsType } from '@/types/shared/artists';

export function getFiltersConfig(
  artists: string,
  genres: string,
  availableArtists: ArtistsType,
  availableGenres: GenresType,
  onArtistChange: (v: string) => void,
  onGenreChange: (v: string) => void
) {
  return [
    {
      value: artists,
      onChange: onArtistChange,
      testid: 'filter-artist',
      placeholder: 'Filter by artist',
      availableOptions: availableArtists,
      selectedItem: ALL_ARTISTS,
    },
    {
      value: genres,
      onChange: onGenreChange,
      testid: 'filter-genre',
      placeholder: 'Filter by genre',
      availableOptions: availableGenres,
      selectedItem: ALL_GENRES,
    },
  ];
}

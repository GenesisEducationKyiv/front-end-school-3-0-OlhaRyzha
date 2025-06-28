import { ALL_GENRES } from '@/constants/labels.constant';

export function getGenreValue(paramGenre?: string | null) {
  return paramGenre && paramGenre?.trim() !== '' ? paramGenre : ALL_GENRES;
}

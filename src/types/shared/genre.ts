import { SetFieldValueType } from '../form';

export type ToggleGenre = (
  genre: string,
  currentGenres: string[],
  setFieldValue: SetFieldValueType
) => void;

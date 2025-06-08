import { genresSchema } from '@/schemas/genres.schemas';
import { SetFieldValueType } from '../form';
import z from 'zod';

export type GenresType = z.infer<typeof genresSchema>;

export type ToggleGenre = (
  genre: string,
  currentGenres: string[],
  setFieldValue: SetFieldValueType
) => void;

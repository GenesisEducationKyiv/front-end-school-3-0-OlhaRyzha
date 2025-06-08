import { API_ROUTES } from '@/constants/api.constant';
import apiClient from '../BaseService';
import { GenresType } from '@/types/shared/genre';
import { safeFetch } from '@/utils/safeFetch';
import { genresSchema } from '@/schemas/genres.schemas';

const Genres = {
  getAll: (): Promise<GenresType> =>
    safeFetch(apiClient.get(API_ROUTES.GENRES), genresSchema),
};

export default Genres;

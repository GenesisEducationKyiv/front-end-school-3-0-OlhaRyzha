import { useQuery } from '@tanstack/react-query';
import { GENRES_QUERY_KEY } from '@/constants/queryKeys.constants';
import { GenresService } from '@/services';

export const useGenresQuery = () => {
  return useQuery<string[]>({
    queryKey: GENRES_QUERY_KEY,
    queryFn: GenresService.getAll,
  });
};

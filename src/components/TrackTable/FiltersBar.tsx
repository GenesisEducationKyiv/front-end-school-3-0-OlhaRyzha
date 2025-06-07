import { FC } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { QueryParams } from '@/types/shared/track';
import { ALL_ARTISTS, ALL_GENRES } from '@/constants/labels.constant';
import { getFilterChangeHandler } from '@/utils/table/filters/getFilterChangeHandler';
import { getFiltersConfig } from '@/configs/tableConfig';
import { SetParamsType } from '@/types/shared/table';

export interface FiltersBarProps {
  params: QueryParams;
  setParams: SetParamsType;
  availableArtists: string[];
  availableGenres: string[];
}

const FiltersBar: FC<FiltersBarProps> = ({
  params,
  setParams,
  availableArtists,
  availableGenres,
}) => {
  const onArtistChange = getFilterChangeHandler(
    'artist',
    ALL_ARTISTS,
    setParams
  );
  const onGenreChange = getFilterChangeHandler('genre', ALL_GENRES, setParams);

  const FILTERS_LIST = getFiltersConfig(
    params,
    availableArtists,
    availableGenres,
    onArtistChange,
    onGenreChange
  );

  return (
    <div className='flex gap-4'>
      {FILTERS_LIST.map((filter) => (
        <Select
          key={filter.testid}
          value={filter.value}
          onValueChange={filter.onChange}
          data-testid={filter.testid}>
          <SelectTrigger className='w-[180px]'>
            <SelectValue placeholder={filter.placeholder} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem
              className='capitalize'
              value={filter.selectedItem}>
              {filter.selectedItem}
            </SelectItem>
            {filter.availableOptions?.map((option) => (
              <SelectItem
                key={option}
                value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ))}
    </div>
  );
};
export default FiltersBar;

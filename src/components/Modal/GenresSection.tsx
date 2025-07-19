import { cn } from '@/lib/utils';
import { SetFieldValueType } from '@/types/form';
import { ToggleGenre } from '@/types/shared/genre';
import { ErrorMessage } from 'formik';
import { Plus, X } from '@/components/icons';
import { Button } from 'tracks-manager-ui';

interface GenresSectionProps {
  selectedGenres: string[];
  allGenres: string[];
  toggleGenre: ToggleGenre;
  setFieldValue: SetFieldValueType;
}

const GenresSection = ({
  selectedGenres,
  allGenres,
  toggleGenre,
  setFieldValue,
}: GenresSectionProps) => (
  <div>
    <p className='text-sm font-medium mb-2'>Genres:</p>
    <div
      className='genres-section-list'
      data-testid='genre-selector'>
      {allGenres.map((genre) => {
        const selected = selectedGenres.includes(genre);
        return (
          <Button
            type='button'
            size='sm'
            key={genre}
            onClick={() => toggleGenre(genre, selectedGenres, setFieldValue)}
            className={cn({
              ['selected']: selected,
              ['unselected']: !selected,
            })}>
            {genre}
            {selected ? (
              <X
                className='h-3 w-3 shrink-0'
                aria-label='Remove genre'
              />
            ) : (
              <Plus
                className='h-3 w-3 shrink-0 font-black'
                aria-label='Add genre'
              />
            )}
          </Button>
        );
      })}
    </div>
    <ErrorMessage
      name='genres'
      component='p'
      className='genre-error'
      data-testid='error-genre'
    />
  </div>
);
export default GenresSection;

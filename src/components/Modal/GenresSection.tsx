import { cn } from '@/lib/utils';
import { SetFieldValueType } from '@/types/form';
import { ErrorMessage } from 'formik';
import { Plus, X } from 'lucide-react';

interface GenresSectionProps {
  selectedGenres: string[];
  allGenres: string[];
  toggleGenre: (
    genre: string,
    currentGenres: string[],
    setFieldValue: SetFieldValueType
  ) => void;
  setFieldValue: SetFieldValueType;
}

const GenresSection = ({
  selectedGenres,
  allGenres,
  toggleGenre,
  setFieldValue,
}: GenresSectionProps) => (
  <div>
    <p className='text-sm font-medium mb-1'>Genres</p>
    <div
      className='flex flex-wrap gap-2'
      data-testid='genre-selector'>
      {allGenres.map((genre) => {
        const selected = selectedGenres.includes(genre);
        return (
          <button
            type='button'
            key={genre}
            onClick={() => toggleGenre(genre, selectedGenres, setFieldValue)}
            className={cn(
              'flex items-center gap-1 rounded border px-2 py-1 text-sm transition-colors',
              selected
                ? 'bg-gray-800 text-white hover:bg-gray-700'
                : 'bg-gray-100 hover:bg-gray-200'
            )}>
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
          </button>
        );
      })}
    </div>
    <ErrorMessage
      name='genres'
      component='p'
      className='text-red-500 text-xs'
      data-testid='error-genre'
    />
  </div>
);
export default GenresSection;

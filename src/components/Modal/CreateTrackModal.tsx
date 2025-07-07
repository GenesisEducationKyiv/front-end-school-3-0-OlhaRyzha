import { useMemo } from 'react';
import { Formik, Form, FormikHelpers } from 'formik';
import {
  useCreateTrack,
  useUpdateTrack,
} from '@/utils/hooks/tanStackQuery/useTracksQuery';
import { useGenresQuery } from '@/utils/hooks/tanStackQuery/useGenresQuery';
import { DialogHeader, DialogContent, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import {
  formFields,
  getInitialValues,
  validationSchema,
} from '@/configs/formConfig';
import { Track, CreateTrackDto } from '@/types/shared/track';
import defaultCover from '@/assets/image_not_available.webp';
import { BTNS_LABELS } from '@/constants/labels.constant';
import { Loader } from '../shared';
import { normalizeCoverImage } from '@/utils/normalizeCoverImage';
import FormField from './FormField';
import GenresSection from './GenresSection';
import { SetFieldValueType } from '@/types/form';
import { GenresType } from '@/types/shared/genre';
import { useToast } from '@/utils/hooks/use-toast';
import { ApiError } from '@/utils/apiError';

export interface CreateTrackModalProps {
  track?: Track;
  onClose: () => void;
}

function CreateTrackModal({ track, onClose }: CreateTrackModalProps) {
  const { data: genresList = [], isLoading: loadingGenres } = useGenresQuery();
  const { mutateAsync: createTrack } = useCreateTrack();
  const { mutateAsync: updateTrack } = useUpdateTrack();
  const { toast } = useToast();

  const initialValues = useMemo<CreateTrackDto>(
    () => getInitialValues(track),
    [track]
  );

  const handleSubmit = async (
    values: CreateTrackDto,
    { setSubmitting }: FormikHelpers<CreateTrackDto>
  ) => {
    try {
      const payload = {
        ...values,
        coverImage: normalizeCoverImage(values.coverImage),
      };

      track
        ? await updateTrack({ id: track.id, payload })
        : await createTrack(payload);

      onClose();
    } catch (err: unknown) {
      const apiError = ApiError.fromUnknown(err);
      toast({
        title: 'Error',
        description: apiError.userMessage,
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };
  const toggleGenre = (
    genre: string,
    currentGenres: GenresType,
    setFieldValue: SetFieldValueType
  ) => {
    const newGenres = currentGenres.includes(genre)
      ? currentGenres.filter((g) => g !== genre)
      : [...currentGenres, genre];
    setFieldValue('genres', newGenres);
  };

  if (loadingGenres) {
    return <Loader loading={loadingGenres} />;
  }

  return (
    <DialogContent
      aria-describedby={undefined}
      className='bg-white rounded-lg p-6 w-full max-h-[90vh] overflow-y-auto max-w-md'>
      <DialogHeader>
        <DialogTitle>
          {track ? BTNS_LABELS.UPDATE_TRACK : BTNS_LABELS.CREATE_TRACK}
        </DialogTitle>
      </DialogHeader>

      <Formik
        data-testid='track-form'
        enableReinitialize
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}>
        {({ values, setFieldValue, isSubmitting, dirty, isValid }) => {
          const previewSrc = normalizeCoverImage(values.coverImage);
          return (
            <Form className='space-y-4'>
              <div className='flex justify-center'>
                <img
                  src={previewSrc || defaultCover}
                  alt='Cover preview'
                  className='h-32 w-32 object-cover rounded-md shadow'
                  loading='lazy'
                />
              </div>

              {formFields.map((field) => (
                <FormField
                  key={field.name}
                  name={field.name}
                  label={field.label}
                  placeholder={field.placeholder}
                  testId={field.testId}
                  errorTestId={field.errorTestId}
                />
              ))}

              <GenresSection
                selectedGenres={values?.genres}
                allGenres={genresList}
                toggleGenre={toggleGenre}
                setFieldValue={setFieldValue}
              />
              <div className='flex justify-end space-x-3 pt-4 border-t'>
                <Button
                  type='button'
                  variant='outline'
                  onClick={onClose}
                  disabled={isSubmitting}>
                  {BTNS_LABELS.CANCEL}
                </Button>
                <Button
                  type='submit'
                  data-testid='submit-button'
                  disabled={isSubmitting || !dirty || !isValid}>
                  {isSubmitting ? BTNS_LABELS.SAVING : BTNS_LABELS.SAVE}
                </Button>
              </div>
            </Form>
          );
        }}
      </Formik>
    </DialogContent>
  );
}
export default CreateTrackModal;

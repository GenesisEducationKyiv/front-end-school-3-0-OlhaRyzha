import { cn } from '@/lib/utils';
import { Input } from '../ui/input';
import { Field, ErrorMessage, FieldProps } from 'formik';
import { FormikError, RadioButton } from '../shared';
import { useCoverImageField } from '@/utils/hooks/useCoverImageField';
import { COVER_IMAGE_FIELD_NAME } from '@/constants/fieldNames.constants';

const CoverImageField = ({
  placeholder = 'Enter image URL',
  testId,
  errorTestId,
}: {
  placeholder?: string;
  testId?: string;
  errorTestId?: string;
}) => {
  const { inputType, setInputType, handleUrlChange, handleFileChange } =
    useCoverImageField();

  return (
    <div className='space-y-2'>
      <div className='flex gap-2'>
        <RadioButton
          active={inputType === 'url'}
          onClick={() => setInputType('url')}>
          Link
        </RadioButton>
        <RadioButton
          active={inputType === 'file'}
          onClick={() => setInputType('file')}>
          Upload
        </RadioButton>
      </div>

      {inputType === 'url' ? (
        <Field name={COVER_IMAGE_FIELD_NAME}>
          {({ field, meta }: FieldProps) => (
            <div>
              <Input
                {...field}
                value={field.value as string}
                onChange={handleUrlChange}
                placeholder={placeholder}
                data-testid={testId}
                className={cn(
                  'custom-input',
                  meta.touched && meta.error && 'border-red-500'
                )}
              />
              <FormikError
                name={field?.name}
                errorTestId={errorTestId}
              />
            </div>
          )}
        </Field>
      ) : (
        <div>
          <Input
            type='file'
            accept='image/*'
            onChange={handleFileChange}
            className='w-full border-2'
            data-testid={testId}
          />
          <ErrorMessage name={COVER_IMAGE_FIELD_NAME}>
            {(msg) => (
              <p
                className='text-red-600 text-sm mt-1'
                data-testid={errorTestId}>
                {msg}
              </p>
            )}
          </ErrorMessage>
        </div>
      )}
    </div>
  );
};
export default CoverImageField;

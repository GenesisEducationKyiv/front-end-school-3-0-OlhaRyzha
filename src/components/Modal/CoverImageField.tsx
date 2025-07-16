import { cn } from '@/lib/utils';
import { Input } from '../ui/input';
import { Field, FieldProps } from 'formik';
import { FormikError, RadioButton } from '../shared';
import { COVER_IMAGE_FIELD_NAME } from '@/constants/fieldNames.constants';
import { isUrl } from '@/utils/guards/isUrl';
import { INPUT_COVER_IMG_TYPES } from '@/types/input';
import { isFileType } from '@/utils/guards/isFile';
import { useCoverImageField } from '@/utils/hooks/cover/useCoverImageField';

type CoverImageFieldProps = {
  placeholder?: string;
  testId?: string;
  errorTestId?: string;
};

const CoverImageField = ({
  placeholder = 'Enter image URL',
  testId,
  errorTestId,
}: CoverImageFieldProps) => {
  const { inputType, setInputType, handleUrlChange, handleFileChange } =
    useCoverImageField();

  const isUrlType = isUrl(inputType);
  const isFile = isFileType(inputType);

  return (
    <div className='space-y-2'>
      <div className='flex gap-2 mt-2'>
        <RadioButton
          active={isUrlType}
          onClick={() => setInputType(INPUT_COVER_IMG_TYPES[0])}>
          Link
        </RadioButton>
        <RadioButton
          active={isFile}
          onClick={() => setInputType(INPUT_COVER_IMG_TYPES[1])}>
          Upload
        </RadioButton>
      </div>

      {isUrlType ? (
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
          <FormikError
            name={COVER_IMAGE_FIELD_NAME}
            errorTestId={errorTestId}
          />
        </div>
      )}
    </div>
  );
};
export default CoverImageField;

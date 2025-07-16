import { cn } from '@/lib/utils';
import { Label } from '@radix-ui/react-label';
import { Field, FieldProps } from 'formik';
import { FormikError } from '../shared';
import { isCoverImageField } from '@/utils/guards/isCoverImageField';
import CoverImageField from './CoverImageField';
import { Input } from 'tracks-manager-ui';

interface FormFieldProps {
  name: string;
  label: string;
  placeholder?: string;
  testId?: string;
  errorTestId?: string;
}

const FormField = ({
  name,
  label,
  placeholder,
  testId,
  errorTestId,
}: FormFieldProps) => {
  const isCoverImage = isCoverImageField(name);

  return (
    <div className='mb-4'>
      <Label
        htmlFor={name}
        className='block mb-1 text-sm font-medium'>
        {label}
      </Label>

      <Field name={name}>
        {({ field, meta }: FieldProps) => (
          <div>
            {isCoverImage ? (
              <CoverImageField
                placeholder={placeholder}
                testId={testId}
                errorTestId={errorTestId}
              />
            ) : (
              <Input
                {...field}
                value={field.value ?? ''}
                id={name}
                data-testid={testId}
                placeholder={placeholder}
                className={cn(
                  'custom-input',
                  meta.touched && meta.error && 'border-red-500'
                )}
              />
            )}
          </div>
        )}
      </Field>

      {!isCoverImage && (
        <FormikError
          name={name}
          errorTestId={errorTestId}
        />
      )}
    </div>
  );
};
export default FormField;

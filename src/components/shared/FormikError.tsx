import { ErrorMessage } from 'formik';

const FormikError = ({
  name,
  errorTestId,
}: {
  name: string;
  errorTestId?: string;
}) => (
  <ErrorMessage name={name}>
    {(msg) => (
      <p
        className='text-red-600 text-sm mt-1'
        data-testid={errorTestId}>
        {msg}
      </p>
    )}
  </ErrorMessage>
);
export default FormikError;

import { ErrorMessage } from 'formik';

interface FormikErrorProps {
  name: string;
  errorTestId?: string;
}
const FormikError = ({ name, errorTestId }: FormikErrorProps) => (
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

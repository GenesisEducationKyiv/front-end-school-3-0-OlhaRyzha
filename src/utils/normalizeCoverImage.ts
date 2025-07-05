import { isString } from 'formik';
import { isFile } from './guards/isFile';

export const normalizeCoverImage = (value?: string | File): string => {
  if (isFile(value)) {
    return URL.createObjectURL(value);
  }
  return isString(value) ? value : '';
};

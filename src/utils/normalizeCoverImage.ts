import { isString } from 'formik';
import { isFile } from './guards/isFile';
import { createObjectUrl } from './objectUrl';

export const normalizeCoverImage = (value?: string | File) => {
  if (isFile(value)) {
    return createObjectUrl(value) ?? '';
  }
  return isString(value) ? value : '';
};

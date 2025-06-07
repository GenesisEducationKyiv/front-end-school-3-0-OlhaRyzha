import { validationMessages } from '@/constants/message.constant';
import { isAxiosError } from 'axios';

export const handleAxiosError = (error: unknown) => {
  if (isAxiosError(error)) {
    return error?.response?.data?.error || validationMessages.error;
  }
  return validationMessages.unknownError;
};

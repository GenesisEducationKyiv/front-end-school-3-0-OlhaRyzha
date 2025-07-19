import { pipe, R } from '@mobily/ts-belt';
import type { Result } from '@mobily/ts-belt';
import z from 'zod';
import { ApiError, ApiErrorType } from '@/utils/apiError';
import {
  audioUploadMessages,
  validationMessages,
} from '@/constants/message.constant';
import { toast } from './hooks/use-toast';
import { isAxiosError } from 'axios';
import { isInvalidAudioBlob } from './guards/isInvalidAudioBlob';
import { IdType } from '@/types/ids';

function handleErrorToastAndThrow<T>(result: Result<T, ApiError>): T {
  return R.match(
    result,
    (value) => value,
    (err) => {
      toast({
        title: 'Error',
        description: err.userMessage,
        variant: 'destructive',
      });
      throw err;
    }
  );
}

export async function safeFetch<T>(
  apiCall: Promise<T>,
  schema: z.Schema<NonNullable<T>>
): Promise<T> {
  const initial: Result<NonNullable<T>, unknown> = await R.fromPromise(apiCall);

  const checked: Result<T, ApiError> = pipe(
    initial,
    R.mapError(ApiError.fromUnknown),
    R.flatMap((response) => {
      const parsed = schema.safeParse(response);
      if (parsed.success) return R.Ok(parsed.data);
      console.error(validationMessages.zodError, parsed.error, response);
      return R.Error(ApiError.fromZod(parsed.error));
    })
  );

  return handleErrorToastAndThrow(checked);
}

export async function fetchVoidResponse(
  apiCall: Promise<unknown>
): Promise<{}> {
  const initial: Result<unknown, unknown> = await R.fromPromise(apiCall);

  const checked: Result<{}, ApiError> = pipe(
    initial,
    R.mapError(ApiError.fromUnknown),
    R.flatMap(() => R.Ok<{}>({}))
  );

  return handleErrorToastAndThrow(checked);
}

export async function safeFetchBlob(
  id: IdType,
  apiCall: Promise<Blob>
): Promise<Blob> {
  const initial: R.Result<Blob, unknown> = await R.fromPromise(apiCall);

  const mappedErrors = pipe(
    initial,
    R.mapError((err) => {
      if (isAxiosError(err) && err.response?.status === 404) {
        return new ApiError(
          ApiErrorType.NotFound,
          `Track ${id}: ${audioUploadMessages.audioNotFound}`
        );
      }
      return ApiError.fromUnknown(err);
    })
  );

  const validated = pipe(
    mappedErrors,
    R.flatMap((blob) => {
      if (isInvalidAudioBlob(blob)) {
        return R.Error(
          new ApiError(
            ApiErrorType.Validation,
            `Track ${id}: ${audioUploadMessages.audioUnavailable}`
          )
        );
      }
      return R.Ok(blob);
    })
  );

  return handleErrorToastAndThrow(validated);
}

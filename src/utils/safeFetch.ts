import { pipe, R } from '@mobily/ts-belt';
import type { Result } from '@mobily/ts-belt';
import z from 'zod';
import { ApiError } from '@/utils/apiError';
import { validationMessages } from '@/constants/message.constant';

export async function safeFetch<T>(
  apiCall: Promise<T>,
  schema?: z.Schema<NonNullable<T>>
): Promise<NonNullable<T>> {
  const initial: Result<T, unknown> = await R.fromPromise(apiCall);

  const checked: Result<NonNullable<T>, ApiError> = pipe(
    initial,
    R.mapError(ApiError.fromUnknown),

    R.flatMap((response) => {
      if (response == null) {
        return R.Error(
          ApiError.fromUnknown(new Error(validationMessages.responseIsNull))
        );
      }
      if (schema) {
        const parsed = schema.safeParse(response);
        if (!parsed.success) {
          console.error(validationMessages.zodError, parsed.error, response);
        }
      }
      return R.Ok(response);
    })
  );

  return R.match(
    checked,
    (value) => value,
    (err) => {
      throw err;
    }
  );
}

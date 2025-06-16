import { pipe, R } from '@mobily/ts-belt';
import type { Result } from '@mobily/ts-belt';
import z from 'zod';
import { ApiError } from '@/utils/apiError';
import { validationMessages } from '@/constants/message.constant';
import { toast } from './hooks/use-toast';

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

  return R.match(
    checked,
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

export async function fetchVoidResponse(
  apiCall: Promise<unknown>
): Promise<void> {
  const initial: Result<unknown, unknown> = await R.fromPromise(apiCall);

  const checked: Result<{}, ApiError> = pipe(
    initial,
    R.mapError(ApiError.fromUnknown),
    R.flatMap(() => R.Ok<{}>({}))
  );

  return R.match(
    checked,
    () => undefined,
    (err) => {
      throw err;
    }
  );
}

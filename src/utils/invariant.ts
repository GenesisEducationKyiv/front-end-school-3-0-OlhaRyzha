import { ApiError, ApiErrorType } from './apiError';

export function invariant(
  condition: unknown,
  errorOrMessage: Error | string = 'Invariant failed'
): asserts condition {
  if (condition) return;

  if (typeof errorOrMessage === 'string') {
    throw new ApiError(ApiErrorType.Validation, errorOrMessage);
  }
  throw errorOrMessage;
}

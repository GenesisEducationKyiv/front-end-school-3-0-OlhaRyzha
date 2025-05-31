import { QueryParams } from '@/types/shared/track';
import { isNonEmptyArray } from './guards/isNonEmptyArray';

export function cleanParams(params: QueryParams): Record<string, string> {
  const cleanedParams: Record<string, string> = {};

  Object.entries(params).forEach(([key, value]) => {
    if (!value) return;

    if (isNonEmptyArray(value)) {
      const filtered = value.filter((item) => item != null && item !== '');
      if (filtered.length > 0) {
        cleanedParams[key] = filtered.join(',');
      }
    } else {
      cleanedParams[key] = String(value);
    }
  });

  return cleanedParams;
}

import { ZodSchema } from 'zod';

export async function safeFetch<T>(
  promise: Promise<unknown>,
  schema: ZodSchema<T>
): Promise<T> {
  const data = await promise;
  const parsed = schema.safeParse(data);
  if (!parsed.success) {
    console.error('[ZOD PARSE ERROR]', parsed.error, data);
    throw new Error('Response validation failed');
  }
  return parsed.data;
}

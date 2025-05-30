export const normalizeCoverImage = (value?: string | File): string => {
  if (value instanceof File) {
    return URL.createObjectURL(value);
  }
  return typeof value === 'string' ? value : '';
};

export const INPUT_COVER_IMG_TYPES = ['url', 'file'] as const;
export type InputCoverImageType = (typeof INPUT_COVER_IMG_TYPES)[number];
export type CoverImageValue = string | File | null;

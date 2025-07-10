import { validationMessages } from '@/constants/message.constant';
import { CreateTrackDto, Track } from '@/types/shared/track';
import { isBlobUrl } from '@/utils/guards/isBlobUrl';
import { isFile } from '@/utils/guards/isFile';
import { isString } from '@/utils/guards/isString';
import { z } from 'zod';

const allowedSchemes = ['http:', 'https:', 'blob:'];

const allowedHosts = [
  'images.unsplash.com',
  'cdn.pixabay.com',
  'picsum.photos',
];

const allowedImageTypes = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
];

const maxFileSize = 5 * 1024 * 1024;

export const validationSchema = z.object({
  title: z.string({
    required_error: validationMessages.requiredField('Title'),
  }),

  artist: z.string({
    required_error: validationMessages.requiredField('Artist'),
  }),

  album: z.string().optional(),

  coverImage: z
    .union([z.string(), z.custom<File>(isFile)])
    .nullable()
    .refine(
      (value) => {
        if (!value) return true;
        if (isString(value)) {
          try {
            const url = new URL(value);
            return allowedSchemes.includes(url.protocol);
          } catch {
            return false;
          }
        }
        return allowedImageTypes.includes(value.type);
      },
      { message: validationMessages.url }
    )
    .refine(
      (value) => {
        if (!value || !isString(value)) return true;
        try {
          const url = new URL(value);
          return isBlobUrl(url.protocol) || allowedHosts.includes(url.hostname);
        } catch {
          return false;
        }
      },
      { message: validationMessages.invalidHost }
    )
    .refine((value) => !(isFile(value) && value.size > maxFileSize), {
      message: validationMessages.lengthMax('5MB'),
    }),

  genres: z.array(z.string()).min(1, validationMessages.selectAtLeastOne),
});

export const getInitialValues = (track?: Track): CreateTrackDto => ({
  title: track?.title || '',
  artist: track?.artist || '',
  album: track?.album || '',
  coverImage: track?.coverImage || '',
  genres: track?.genres || [],
});

export const formFields = [
  {
    name: 'title',
    label: 'Title',
    placeholder: 'Track title',
    testId: 'input-title',
    errorTestId: 'error-title',
  },
  {
    name: 'artist',
    label: 'Artist',
    placeholder: 'Artist name',
    testId: 'input-artist',
    errorTestId: 'error-artist',
  },
  {
    name: 'album',
    label: 'Album',
    placeholder: 'Album name',
    testId: 'input-album',
    errorTestId: 'error-album',
  },
  {
    name: 'coverImage',
    label: 'Cover Image URL',
    placeholder: 'https://...',
    testId: 'input-cover-image',
    errorTestId: 'error-coverImage',
  },
];

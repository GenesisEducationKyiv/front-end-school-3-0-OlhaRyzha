import { validationMessages } from '@/constants/message.constant';
import { CreateTrackDto, Track } from '@/types/shared/track';
import * as Yup from 'yup';

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
const maxFileSize = 5 * 1024 * 1024; // 5MB

export const validationSchema = Yup.object({
  title: Yup.string().required(validationMessages.required),
  artist: Yup.string().required(validationMessages.required),
  album: Yup.string().optional(),
  coverImage: Yup.mixed()
    .nullable()
    .test('is-valid-url-or-file', validationMessages.url, (value) => {
      if (!value) return true;

      if (typeof value === 'string') {
        try {
          const url = new URL(value);
          return allowedSchemes.includes(url.protocol);
        } catch {
          return false;
        }
      }

      if (value instanceof File) {
        return allowedImageTypes.includes(value.type);
      }

      return false;
    })
    .test('valid-host-if-url', validationMessages.invalidHost, (value) => {
      if (!value || typeof value !== 'string') return true;

      try {
        const url = new URL(value);
        if (url.protocol === 'blob:') return true;
        return allowedHosts.includes(url.hostname);
      } catch {
        return true;
      }
    })
    .test('max-size-if-file', validationMessages.lengthMax('5MB'), (value) => {
      if (value instanceof File) {
        return value.size <= maxFileSize;
      }
      return true;
    }),
  genres: Yup.array()
    .of(Yup.string())
    .min(1, validationMessages.selectAtLeastOne),
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

import { z } from 'zod';

const baseTrackSchema = z.object({
  title: z.string(),
  artist: z.string(),
  album: z.string().optional(),
  genres: z.array(z.string()),
  coverImage: z.string().optional(),
});

export const trackSchema = baseTrackSchema.extend({
  id: z.string(),
  slug: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  audioFile: z.string().optional(),
});

export const createTrackDtoSchema = baseTrackSchema;

export const updateTrackDtoSchema = baseTrackSchema.partial().extend({
  audioFile: z.string().optional(),
});

export const metaSchema = z.object({
  total: z.number(),
  page: z.number(),
  limit: z.number(),
  totalPages: z.number(),
});

export const paginatedResponseSchema = <T extends z.ZodTypeAny>(
  itemSchema: T
) =>
  z.object({
    data: z.array(itemSchema),
    meta: metaSchema,
  });

export const batchDeleteResponseSchema = z.object({
  success: z.array(z.string()),
  failed: z.array(z.string()),
});

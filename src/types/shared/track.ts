import z from 'zod';
import {
  batchDeleteResponseSchema,
  createTrackDtoSchema,
  metaSchema,
  trackSchema,
  updateTrackDtoSchema,
} from '@/schemas/track.schemas';

export type Track = z.infer<typeof trackSchema>;

export type CreateTrackDto = z.infer<typeof createTrackDtoSchema>;
export type UpdateTrackDto = z.infer<typeof updateTrackDtoSchema>;
export type Meta = z.infer<typeof metaSchema>;
export type BatchDeleteResponse = z.infer<typeof batchDeleteResponseSchema>;

export type Sort = 'title' | 'artist' | 'album' | 'createdAt' | '';
export type Order = 'asc' | 'desc' | '';

export interface QueryParams {
  page?: number | string;
  limit?: number;
  sort?: Sort;
  order?: Order;
  search?: string;
  genre?: string | null;
  artist?: string | null;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: Meta;
}

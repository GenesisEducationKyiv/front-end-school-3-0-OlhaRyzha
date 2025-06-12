import { artistsSchema } from '@/schemas/artists.schemas';
import z from 'zod';

export type ArtistsType = z.infer<typeof artistsSchema>;

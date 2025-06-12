import z from 'zod';

export const artistsSchema = z.array(z.string());

import { z } from 'zod';

export const paginationSchema = z.object({
    query: z.object({
      page: z.coerce.number().int().positive().default(1),
      perPage: z.coerce.number().int().positive().default(10)
    })
  });
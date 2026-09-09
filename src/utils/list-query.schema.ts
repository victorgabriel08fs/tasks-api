import z from 'zod';

export interface ListQuery {
  page: number;
  limit: number;
  sortBy?: string;
}

export const listQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  sortBy: z.coerce.string().optional(),
});

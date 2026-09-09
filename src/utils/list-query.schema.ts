import z from 'zod';

export const sortDirectionSchema = z
  .preprocess(
    (v) => (typeof v === 'string' ? v.toLowerCase() : v),
    z.enum(['asc', 'desc']),
  )
  .default('asc');

export type SortDirection = z.infer<typeof sortDirectionSchema>;

export function createListQuerySchema<
  const T extends readonly [string, ...string[]],
>(sortableKeys: T) {
  return z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
    sortBy: z.enum(sortableKeys).optional(),
    direction: sortDirectionSchema,
  });
}

export interface ListQuery<TSortKey extends string = string> {
  page: number;
  limit: number;
  sortBy?: TSortKey;
  direction: SortDirection;
}

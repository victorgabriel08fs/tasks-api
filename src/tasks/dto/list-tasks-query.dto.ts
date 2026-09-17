import z from 'zod';
import { createListQuerySchema } from '../../utils/list-query.schema.js';

export const listTasksQuerySchema = createListQuerySchema([
  'title',
  'done',
  'createdAt',
  'updatedAt',
], [
  'title',
  'description',
]);

export type ListTasksQuery = z.infer<typeof listTasksQuerySchema>;

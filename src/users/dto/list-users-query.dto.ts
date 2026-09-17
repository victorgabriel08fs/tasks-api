import z from 'zod';
import { createListQuerySchema } from '../../utils/list-query.schema.js';

export const listUsersQuerySchema = createListQuerySchema(
  ['name', 'email', 'createdAt', 'updatedAt'],
  ['name', 'email'],
);

export type ListUsersQuery = z.infer<typeof listUsersQuerySchema>;

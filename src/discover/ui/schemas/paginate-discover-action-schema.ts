import { z } from "zod";

export const PaginateDiscoverActionSchema = z.object({
  query: z.string().optional(),
  paginationToken: z.string().optional(),
  limit: z.number().int().positive().optional(),
});

export type PaginateDiscoverActionModel = z.infer<
  typeof PaginateDiscoverActionSchema
>;

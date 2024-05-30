import { z } from "@/i18n/zod";

export const PaginateCoursesByAuthorActionSchema = z.object({
  profileId: z.string(),
  paginationToken: z.string().optional(),
  limit: z.number().optional(),
});

export type PaginateCoursesByAuthorActionModel = z.infer<
  typeof PaginateCoursesByAuthorActionSchema
>;

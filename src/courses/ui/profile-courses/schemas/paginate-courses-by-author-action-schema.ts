import { z } from "@/i18n/zod";

/**
 * Validates the parameters of `paginateCoursesByAuthorAction`
 */
export const PaginateCoursesByAuthorActionSchema = z.object({
  profileId: z.string(),
  paginationToken: z.string().optional(),
  limit: z.number().optional(),
});

/**
 * Parameters of `paginateCoursesByAuthorAction`
 */
export type PaginateCoursesByAuthorActionModel = z.infer<
  typeof PaginateCoursesByAuthorActionSchema
>;

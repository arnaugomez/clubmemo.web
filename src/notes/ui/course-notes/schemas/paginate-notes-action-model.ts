import { z } from "@/i18n/zod";
import { ObjectIdSchema } from "@/src/common/schemas/object-id-schema";

/**
 * Validates the parameters of `paginateNotesAction`
 */
export const PaginateNotesActionSchema = z.object({
  courseId: ObjectIdSchema,
  page: z.number().int().optional(),
  pageSize: z.number().int().optional(),
});

/**
 * Parameters of `paginateNotesAction`
 */
export type PaginateNotesActionModel = z.infer<
  typeof PaginateNotesActionSchema
>;

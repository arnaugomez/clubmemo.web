import { z } from "@/i18n/zod";
import { ObjectIdSchema } from "@/src/common/schemas/object-id-schema";

export const PaginateNotesActionSchema = z.object({
  courseId: ObjectIdSchema,
  page: z.number().optional(),
  pageSize: z.number().optional(),
});

export type PaginateNotesActionModel = z.infer<
  typeof PaginateNotesActionSchema
>;

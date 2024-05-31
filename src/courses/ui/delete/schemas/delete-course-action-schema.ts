import { z } from "@/i18n/zod";
import { ObjectIdSchema } from "@/src/common/schemas/object-id-schema";

/**
 * Validates the parameters of `deleteCourseAction`
 */
export const DeleteCourseActionSchema = z.object({
  id: ObjectIdSchema,
});

/**
 * Parameters of `deleteCourseAction`
 */
export type DeleteCourseActionModel = z.infer<typeof DeleteCourseActionSchema>;

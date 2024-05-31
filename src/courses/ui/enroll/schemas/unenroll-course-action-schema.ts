import { z } from "@/i18n/zod";
import { ObjectIdSchema } from "@/src/common/schemas/object-id-schema";

/**
 * Validates the parameters of `unenrollCourseAction`
 */
export const UnenrollCourseActionSchema = z.object({
  courseId: ObjectIdSchema,
});

/**
 * Parameters of `unenrollCourseAction`
 */
export type UnenrollCourseActionModel = z.infer<
  typeof UnenrollCourseActionSchema
>;

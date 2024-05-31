import { z } from "@/i18n/zod";
import { ObjectIdSchema } from "@/src/common/schemas/object-id-schema";

/**
 * Validates the parameters of `enrollCourseAction`
 */
export const EnrollCourseActionSchema = z.object({
  courseId: ObjectIdSchema,
});

/**
 * Parameters of `enrollCourseAction`
 */
export type EnrollCourseActionModel = z.infer<typeof EnrollCourseActionSchema>;

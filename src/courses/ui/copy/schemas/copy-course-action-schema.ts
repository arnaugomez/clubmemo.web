import { z } from "@/i18n/zod";
import { ObjectIdSchema } from "@/src/common/schemas/object-id-schema";

/**
 * Validates the parameters of `copyCourseAction`
 */
export const CopyCourseActionSchema = z.object({
  courseId: ObjectIdSchema,
});

/**
 * Parameters of `copyCourseAction`
 */
export type CopyCourseActionModel = z.infer<typeof CopyCourseActionSchema>;

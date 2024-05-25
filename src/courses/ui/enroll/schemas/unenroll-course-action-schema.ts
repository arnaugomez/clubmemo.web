import { z } from "@/i18n/zod";
import { ObjectIdSchema } from "@/src/common/schemas/object-id-schema";

export const UnenrollCourseActionSchema = z.object({
  courseId: ObjectIdSchema,
});

export type UnenrollCourseActionModel = z.infer<
  typeof UnenrollCourseActionSchema
>;

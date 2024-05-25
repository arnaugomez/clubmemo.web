import { z } from "@/i18n/zod";
import { ObjectIdSchema } from "@/src/common/schemas/object-id-schema";

export const EnrollCourseActionSchema = z.object({
  courseId: ObjectIdSchema,
});

export type EnrollCourseActionModel = z.infer<typeof EnrollCourseActionSchema>;

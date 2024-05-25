import { z } from "@/i18n/zod";
import { ObjectIdSchema } from "@/src/common/schemas/object-id-schema";

export const CopyCourseActionSchema = z.object({
  courseId: ObjectIdSchema,
});

export type CopyCourseActionModel = z.infer<typeof CopyCourseActionSchema>;

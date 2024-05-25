import { z } from "@/i18n/zod";
import { ObjectIdSchema } from "@/src/common/schemas/object-id-schema";

export const DeleteCourseActionSchema = z.object({
  id: ObjectIdSchema,
});

export type DeleteCourseActionModel = z.infer<typeof DeleteCourseActionSchema>;

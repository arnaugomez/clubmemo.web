import { z } from "@/i18n/zod";
import { ObjectIdSchema } from "@/src/common/schemas/object-id-schema";

export const EditCourseUploadActionSchema = z.object({
  courseId: ObjectIdSchema,
  pictureContentType: z.string(),
  uploadPicture: z.boolean(),
});

export type EditCourseUploadActionModel = z.infer<
  typeof EditCourseUploadActionSchema
>;

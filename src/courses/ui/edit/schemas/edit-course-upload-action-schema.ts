import { z } from "@/i18n/zod";
import { ObjectIdSchema } from "@/src/common/schemas/object-id-schema";

/**
 * Validates the parameters of `editCourseUploadAction`
 */
export const EditCourseUploadActionSchema = z.object({
  courseId: ObjectIdSchema,
  pictureContentType: z.string(),
  uploadPicture: z.boolean(),
});

/**
 * Parameters of `editCourseUploadAction`
 */
export type EditCourseUploadActionModel = z.infer<
  typeof EditCourseUploadActionSchema
>;

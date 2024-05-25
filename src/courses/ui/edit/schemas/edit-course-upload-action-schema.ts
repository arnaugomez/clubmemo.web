import { ObjectId } from "mongodb";
import { z } from "zod";

export const EditCourseUploadActionSchema = z.object({
  courseId: z.string().refine(ObjectId.isValid),
  pictureContentType: z.string(),
  uploadPicture: z.boolean(),
});

export type EditCourseUploadActionModel = z.infer<
  typeof EditCourseUploadActionSchema
>;

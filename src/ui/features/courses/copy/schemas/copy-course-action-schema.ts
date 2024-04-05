import { ObjectId } from "mongodb";
import { z } from "zod";

export const CopyCourseActionSchema = z.object({
  courseId: z.string().refine(ObjectId.isValid, "Invalid ObjectId"),
});

export type CopyCourseActionModel = z.infer<typeof CopyCourseActionSchema>;

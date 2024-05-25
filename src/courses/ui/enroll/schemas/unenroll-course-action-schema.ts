import { ObjectId } from "mongodb";
import { z } from "zod";

export const UnenrollCourseActionSchema = z.object({
  courseId: z.string().refine(ObjectId.isValid),
});

export type UnenrollCourseActionModel = z.infer<
  typeof UnenrollCourseActionSchema
>;

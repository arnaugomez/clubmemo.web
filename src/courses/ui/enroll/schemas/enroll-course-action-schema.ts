import { ObjectId } from "mongodb";
import { z } from "zod";

export const EnrollCourseActionSchema = z.object({
  courseId: z.string().refine(ObjectId.isValid),
});

export type EnrollCourseActionModel = z.infer<typeof EnrollCourseActionSchema>;

import { ObjectId } from "mongodb";
import { z } from "zod";

export const DeleteCourseActionSchema = z.object({
  id: z.string().refine(ObjectId.isValid),
});

export type DeleteCourseActionModel = z.infer<typeof DeleteCourseActionSchema>;

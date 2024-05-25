import { ObjectId } from "mongodb";
import { z } from "zod";

export const FavoriteCourseActionSchema = z.object({
  courseId: z.string().refine(ObjectId.isValid),
  isFavorite: z.boolean(),
});

export type FavoriteCourseActionModel = z.infer<
  typeof FavoriteCourseActionSchema
>;

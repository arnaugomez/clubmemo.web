import { z } from "@/i18n/zod";
import { ObjectIdSchema } from "@/src/common/schemas/object-id-schema";

export const FavoriteCourseActionSchema = z.object({
  courseId: ObjectIdSchema,
  isFavorite: z.boolean(),
});

export type FavoriteCourseActionModel = z.infer<
  typeof FavoriteCourseActionSchema
>;

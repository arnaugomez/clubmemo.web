import * as Schema from "effect/Schema";

import { ObjectIdSchema } from "@/src/common/schemas/object-id-schema";

/**
 * Validates the parameters of `favoriteCourseAction`
 */
export const FavoriteCourseActionSchema = Schema.Struct({
  courseId: ObjectIdSchema,
  isFavorite: Schema.Boolean,
});

export type FavoriteCourseActionModel =
  (typeof FavoriteCourseActionSchema)["Type"];

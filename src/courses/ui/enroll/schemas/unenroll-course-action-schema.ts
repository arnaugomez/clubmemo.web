import * as Schema from "effect/Schema";

import { ObjectIdSchema } from "@/src/common/schemas/object-id-schema";

/**
 * Validates the parameters of `unenrollCourseAction`
 */
export const UnenrollCourseActionSchema = Schema.Struct({
  courseId: ObjectIdSchema,
});

/**
 * Parameters of `unenrollCourseAction`
 */
export type UnenrollCourseActionModel =
  (typeof UnenrollCourseActionSchema)["Type"];

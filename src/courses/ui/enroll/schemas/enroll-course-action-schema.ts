import * as Schema from "effect/Schema";

import { ObjectIdSchema } from "@/src/common/schemas/object-id-schema";

/**
 * Validates the parameters of `enrollCourseAction`
 */
export const EnrollCourseActionSchema = Schema.Struct({
  courseId: ObjectIdSchema,
});

/**
 * Parameters of `enrollCourseAction`
 */
export type EnrollCourseActionModel = (typeof EnrollCourseActionSchema)["Type"];

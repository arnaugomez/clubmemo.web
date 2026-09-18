import * as Schema from "effect/Schema";

import { ObjectIdSchema } from "@/src/common/schemas/object-id-schema";

/**
 * Validates the parameters of `deleteCourseAction`
 */
export const DeleteCourseActionSchema = Schema.Struct({
  id: ObjectIdSchema,
});

/**
 * Parameters of `deleteCourseAction`
 */
export type DeleteCourseActionModel = (typeof DeleteCourseActionSchema)["Type"];

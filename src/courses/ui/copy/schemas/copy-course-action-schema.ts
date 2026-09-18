import * as Schema from "effect/Schema";

import { ObjectIdSchema } from "@/src/common/schemas/object-id-schema";

/**
 * Validates the parameters of `copyCourseAction`
 */
export const CopyCourseActionSchema = Schema.Struct({
  courseId: ObjectIdSchema,
});

/**
 * Parameters of `copyCourseAction`
 */
export type CopyCourseActionModel = (typeof CopyCourseActionSchema)["Type"];

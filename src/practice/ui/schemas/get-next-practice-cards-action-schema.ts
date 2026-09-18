import * as Schema from "effect/Schema";

import { ObjectIdSchema } from "@/src/common/schemas/object-id-schema";

/**
 * Validates the parameters of `getNextPracticeCardsAction`
 */
export const GetNextPracticeCardsActionSchema = Schema.Struct({
  courseId: ObjectIdSchema,
});

/**
 * The parameters of `getNextPracticeCardsAction`
 */
export type GetNextPracticeCardsActionModel =
  (typeof GetNextPracticeCardsActionSchema)["Type"];

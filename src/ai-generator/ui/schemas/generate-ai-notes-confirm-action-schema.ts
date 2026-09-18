import * as Schema from "effect/Schema";

import { ObjectIdSchema } from "@/src/common/schemas/object-id-schema";

/**
 * Validates the parameters of `generateAiNotesConfirmAction`
 */
export const GenerateAiNotesConfirmActionSchema = Schema.Struct({
  courseId: ObjectIdSchema,
  notes: Schema.mutable(
    Schema.Array(
      Schema.Struct({
        front: Schema.String,
        back: Schema.String,
      }),
    ),
  ),
});

/**
 * Parameters of `generateAiNotesConfirmAction`
 */
export type GenerateAiNotesConfirmActionModel =
  (typeof GenerateAiNotesConfirmActionSchema)["Type"];

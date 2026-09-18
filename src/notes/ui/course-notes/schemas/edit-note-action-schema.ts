import * as Schema from "effect/Schema";

import { ObjectIdSchema } from "@/src/common/schemas/object-id-schema";

export const EditNoteActionSchema = Schema.Struct({
  id: ObjectIdSchema,
  front: Schema.String.check(
    Schema.isMinLength(1, {
      message: `El texto debe contener al menos ${1} carácter(es)`,
    }),
  ).check(
    Schema.isMaxLength(1000, {
      message: `El texto debe contener como máximo ${1000} carácter(es)`,
    }),
  ),
  back: Schema.String.check(
    Schema.isMinLength(0, {
      message: `El texto debe contener al menos ${0} carácter(es)`,
    }),
  ).check(
    Schema.isMaxLength(10000, {
      message: `El texto debe contener como máximo ${10000} carácter(es)`,
    }),
  ),
});

/**
 * Parameters of `editNoteAction`
 */
export type EditNoteActionModel = (typeof EditNoteActionSchema)["Type"];

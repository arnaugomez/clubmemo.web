import * as Schema from "effect/Schema";

import { ObjectIdSchema } from "@/src/common/schemas/object-id-schema";

/**
 * Validates the parameters of `paginateNotesAction`
 */
export const PaginateNotesActionSchema = Schema.Struct({
  courseId: ObjectIdSchema,
  page: Schema.optional(
    Schema.Number.check(Schema.makeFilter((n) => !Number.isNaN(n))).check(
      Schema.isInt({ message: "Se esperaba entero, se recibió decimal" }),
    ),
  ),
  pageSize: Schema.optional(
    Schema.Number.check(Schema.makeFilter((n) => !Number.isNaN(n))).check(
      Schema.isInt({ message: "Se esperaba entero, se recibió decimal" }),
    ),
  ),
});

/**
 * Parameters of `paginateNotesAction`
 */
export type PaginateNotesActionModel =
  (typeof PaginateNotesActionSchema)["Type"];

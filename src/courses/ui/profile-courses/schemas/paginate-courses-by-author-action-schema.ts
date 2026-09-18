import * as Schema from "effect/Schema";

/**
 * Validates the parameters of `paginateCoursesByAuthorAction`
 */
export const PaginateCoursesByAuthorActionSchema = Schema.Struct({
  profileId: Schema.String,
  paginationToken: Schema.optional(Schema.String),
  limit: Schema.optional(
    Schema.Number.check(Schema.makeFilter((n) => !Number.isNaN(n))).check(
      Schema.isInt({ message: "Se esperaba entero, se recibió decimal" }),
    ),
  ),
});

/**
 * Parameters of `paginateCoursesByAuthorAction`
 */
export type PaginateCoursesByAuthorActionModel =
  (typeof PaginateCoursesByAuthorActionSchema)["Type"];

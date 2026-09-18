import * as Schema from "effect/Schema";

/**
 * Validates the parameters of `paginateDiscoverAction`
 */
export const PaginateDiscoverActionSchema = Schema.Struct({
  query: Schema.optional(Schema.String),
  paginationToken: Schema.optional(Schema.String),
  limit: Schema.optional(
    Schema.Number.check(Schema.makeFilter((n) => !Number.isNaN(n)))
      .check(
        Schema.isInt({ message: "Se esperaba entero, se recibió decimal" }),
      )
      .check(
        Schema.isGreaterThan(0, { message: "El número debe ser mayor que 0" }),
      ),
  ),
});

export type PaginateDiscoverActionModel =
  (typeof PaginateDiscoverActionSchema)["Type"];

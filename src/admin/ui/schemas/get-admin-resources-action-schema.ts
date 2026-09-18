import * as Schema from "effect/Schema";

import { SortOrderModel } from "../../domain/models/sort-order-model";
import { AdminResourceTypeSchema } from "./admin-resource-type-schema";

/**
 * Validates the parameters of `getAdminResourcesAction`
 */
export const GetAdminResourcesActionSchema = Schema.Struct({
  resourceType: AdminResourceTypeSchema,
  page: Schema.Number.check(Schema.makeFilter((n) => !Number.isNaN(n)))
    .check(Schema.isInt({ message: "Se esperaba entero, se recibió decimal" }))
    .check(
      Schema.isGreaterThan(0, { message: "El número debe ser mayor que 0" }),
    )
    .check(
      Schema.isGreaterThanOrEqualTo(1, {
        message: `El número debe ser mayor o igual a ${1}`,
      }),
    ),
  pageSize: Schema.Number.check(Schema.makeFilter((n) => !Number.isNaN(n)))
    .check(Schema.isInt({ message: "Se esperaba entero, se recibió decimal" }))
    .check(
      Schema.isGreaterThan(0, { message: "El número debe ser mayor que 0" }),
    )
    .check(
      Schema.isGreaterThanOrEqualTo(1, {
        message: `El número debe ser mayor o igual a ${1}`,
      }),
    )
    .check(
      Schema.isLessThanOrEqualTo(100, {
        message: `El número debe ser menor o igual a ${100}`,
      }),
    ),
  sortBy: Schema.optional(Schema.String),
  sortOrder: Schema.optional(
    Schema.Literals([SortOrderModel.ascending, SortOrderModel.descending]),
  ),
  query: Schema.optional(Schema.String),
  filters: Schema.optional(Schema.Record(Schema.String, Schema.Unknown)),
});

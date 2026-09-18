import * as Schema from "effect/Schema";
import { default_maximum_interval } from "ts-fsrs";

import { ObjectIdSchema } from "@/src/common/schemas/object-id-schema";

/**
 * Validates the parameters of `editCourseConfigAction`
 */
export const EditCourseConfigActionSchema = Schema.Struct({
  enrollmentId: ObjectIdSchema,
  enableFuzz: Schema.Boolean,
  maximumInterval: Schema.Number.check(
    Schema.makeFilter((n) => !Number.isNaN(n)),
  )
    .check(Schema.isInt({ message: "Se esperaba entero, se recibió decimal" }))
    .check(
      Schema.isGreaterThanOrEqualTo(1, {
        message: `El número debe ser mayor o igual a ${1}`,
      }),
    )
    .check(
      Schema.isLessThanOrEqualTo(default_maximum_interval, {
        message: `El número debe ser menor o igual a ${default_maximum_interval}`,
      }),
    ),
  requestRetention: Schema.Number.check(
    Schema.makeFilter((n) => !Number.isNaN(n)),
  )
    .check(
      Schema.isGreaterThanOrEqualTo(0, {
        message: `El número debe ser mayor o igual a ${0}`,
      }),
    )
    .check(
      Schema.isLessThanOrEqualTo(1, {
        message: `El número debe ser menor o igual a ${1}`,
      }),
    ),
  dailyNewCardsCount: Schema.Number.check(
    Schema.makeFilter((n) => !Number.isNaN(n)),
  )
    .check(Schema.isInt({ message: "Se esperaba entero, se recibió decimal" }))
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
  showAdvancedRatingOptions: Schema.Boolean,
});

/**
 * Parameters of `editCourseConfigAction`
 */
export type EditCourseConfigActionModel =
  (typeof EditCourseConfigActionSchema)["Type"];

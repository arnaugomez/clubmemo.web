import * as Schema from "effect/Schema";

import { ObjectIdSchema } from "@/src/common/schemas/object-id-schema";
import { PracticeCardRatingModelSchema } from "../../domain/schemas/practice-card-rating-model-schema";
import { PracticeCardStateModelSchema } from "../../domain/schemas/practice-card-state-model-schema";

/**
 * Validates the parameters of `practiceAction`
 */
export const PracticeActionSchema = Schema.Struct({
  courseId: ObjectIdSchema,
  card: Schema.Struct({
    id: Schema.String,
    courseEnrollmentId: Schema.String,
    note: Schema.Struct({
      id: Schema.String,
      courseId: Schema.String,
      front: Schema.String,
      back: Schema.String,
      createdAt: Schema.Date,
    }),
    provisionalId: Schema.optional(
      Schema.Number.check(Schema.makeFilter((n) => !Number.isNaN(n))).check(
        Schema.isInt({ message: "Se esperaba entero, se recibió decimal" }),
      ),
    ),
    due: Schema.Date,
    stability: Schema.Number.check(Schema.makeFilter((n) => !Number.isNaN(n))),
    difficulty: Schema.Number.check(Schema.makeFilter((n) => !Number.isNaN(n))),
    elapsedDays: Schema.Number.check(
      Schema.makeFilter((n) => !Number.isNaN(n)),
    ).check(
      Schema.isInt({ message: "Se esperaba entero, se recibió decimal" }),
    ),
    scheduledDays: Schema.Number.check(
      Schema.makeFilter((n) => !Number.isNaN(n)),
    ).check(
      Schema.isInt({ message: "Se esperaba entero, se recibió decimal" }),
    ),
    reps: Schema.Number.check(Schema.makeFilter((n) => !Number.isNaN(n))).check(
      Schema.isInt({ message: "Se esperaba entero, se recibió decimal" }),
    ),
    lapses: Schema.Number.check(
      Schema.makeFilter((n) => !Number.isNaN(n)),
    ).check(
      Schema.isInt({ message: "Se esperaba entero, se recibió decimal" }),
    ),
    state: PracticeCardStateModelSchema,
    lastReview: Schema.optional(Schema.Date),
  }),
  reviewLog: Schema.Struct({
    id: Schema.String,
    cardId: Schema.String,
    courseEnrollmentId: Schema.String,
    rating: PracticeCardRatingModelSchema,
    state: PracticeCardStateModelSchema,
    due: Schema.Date,
    stability: Schema.Number.check(Schema.makeFilter((n) => !Number.isNaN(n))),
    difficulty: Schema.Number.check(Schema.makeFilter((n) => !Number.isNaN(n))),
    elapsedDays: Schema.Number.check(
      Schema.makeFilter((n) => !Number.isNaN(n)),
    ).check(
      Schema.isInt({ message: "Se esperaba entero, se recibió decimal" }),
    ),
    lastElapsedDays: Schema.Number.check(
      Schema.makeFilter((n) => !Number.isNaN(n)),
    ).check(
      Schema.isInt({ message: "Se esperaba entero, se recibió decimal" }),
    ),
    scheduledDays: Schema.Number.check(
      Schema.makeFilter((n) => !Number.isNaN(n)),
    ).check(
      Schema.isInt({ message: "Se esperaba entero, se recibió decimal" }),
    ),
    review: Schema.Date,
  }),
});

/**
 * Parameters of `practiceAction`
 */
export type PracticeActionModel = (typeof PracticeActionSchema)["Type"];

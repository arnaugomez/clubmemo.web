import * as Schema from "effect/Schema";

import { PracticeCardStateModel } from "../models/practice-card-state-model";

/**
 * Validates the values of the `PracticeCardStateModel` enum
 */
export const PracticeCardStateModelSchema = Schema.Literals([
  PracticeCardStateModel.learning,
  PracticeCardStateModel.new,
  PracticeCardStateModel.relearning,
  PracticeCardStateModel.review,
]);

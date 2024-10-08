import { z } from "zod";
import { PracticeCardStateModel } from "../models/practice-card-state-model";

/**
 * Validates the values of the `PracticeCardStateModel` enum
 */
export const PracticeCardStateModelSchema = z.enum([
  PracticeCardStateModel.learning,
  PracticeCardStateModel.new,
  PracticeCardStateModel.relearning,
  PracticeCardStateModel.review,
]);

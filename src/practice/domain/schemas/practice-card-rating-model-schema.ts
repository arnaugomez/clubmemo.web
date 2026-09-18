import * as Schema from "effect/Schema";

import { PracticeCardRatingModel } from "../models/practice-card-rating-model";

export const PracticeCardRatingModelSchema = Schema.Literals([
  PracticeCardRatingModel.again,
  PracticeCardRatingModel.easy,
  PracticeCardRatingModel.good,
  PracticeCardRatingModel.hard,
  PracticeCardRatingModel.manual,
]);

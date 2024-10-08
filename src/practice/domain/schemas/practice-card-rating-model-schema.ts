import { z } from "zod";
import { PracticeCardRatingModel } from "../models/practice-card-rating-model";

export const PracticeCardRatingModelSchema = z.enum([
  PracticeCardRatingModel.again,
  PracticeCardRatingModel.easy,
  PracticeCardRatingModel.good,
  PracticeCardRatingModel.hard,
  PracticeCardRatingModel.manual,
]);

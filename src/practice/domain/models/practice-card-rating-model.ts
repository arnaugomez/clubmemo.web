import { Rating } from "ts-fsrs";

/**
 * It describes how well the user remembered a card on a certain practice. The
 * next review date of the card depends on the rating.
 */
export enum PracticeCardRatingModel {
  again = "again",
  easy = "easy",
  good = "good",
  hard = "hard",
  manual = "manual",
}

/**
 * The days until the next practice of a card, based on the rating given by the
 * user.
 */
export type DaysToNextReviewModel = Record<PracticeCardRatingModel, number>;

/**
 * Converts the domain model `PracticeCardRatingModel` to and from the `Rating`
 * model used by the FSRS algorithm.
 */
export class PracticeCardRatingTransformer {
  constructor(private readonly domain: PracticeCardRatingModel) {}
  toFsrs() {
    switch (this.domain) {
      case PracticeCardRatingModel.again:
        return Rating.Again;
      case PracticeCardRatingModel.hard:
        return Rating.Hard;
      case PracticeCardRatingModel.good:
        return Rating.Good;
      case PracticeCardRatingModel.easy:
        return Rating.Easy;
      case PracticeCardRatingModel.manual:
        return Rating.Manual;
    }
  }

  static fromFsrs(rating: Rating) {
    switch (rating) {
      case Rating.Again:
        return PracticeCardRatingModel.again;
      case Rating.Hard:
        return PracticeCardRatingModel.hard;
      case Rating.Good:
        return PracticeCardRatingModel.good;
      case Rating.Easy:
        return PracticeCardRatingModel.easy;
      case Rating.Manual:
        return PracticeCardRatingModel.manual;
    }
  }
}

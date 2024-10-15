import type { CourseEnrollmentModel } from "@/src/courses/domain/models/course-enrollment-model";
import type { RecordLog } from "ts-fsrs";
import { Rating } from "ts-fsrs";
import { PracticeCardModel } from "./practice-card-model";
import type { DaysToNextReviewModel } from "./practice-card-rating-model";
import {
  PracticeCardRatingModel,
  PracticeCardRatingTransformer,
} from "./practice-card-rating-model";
import { PracticeCardStateTransformer } from "./practice-card-state-model";
import { ReviewLogModel } from "./review-log-model";

interface PracticerData {
  enrollment: CourseEnrollmentModel;
  card: PracticeCardModel;
}

/**
 * Calculates the result of practicing a card.
 *
 * When a card is practiced, the learner must rate the card based on how well
 * they did in the review. The result determines the next time the card should
 * be reviewed, and causes the card to update many of its parameters.
 *
 * This update is decided by the FSRS algorithm, which is a spaced repetition
 * algorithm that determines the optimal time to review a card based on the
 * learner's performance in the previous review.
 *
 * The PracticerModel provides an abstraction over the FSRS algorithm, and uses
 * its API under the hood to calculate the result of practicing a card.
 */
export class PracticerModel {
  private recordLog?: RecordLog;
  constructor(private readonly data: PracticerData) {}

  /**
   * Calculates the result of practicing a card for each possible rating of the user
   */
  practice() {
    const fsrs = this.data.enrollment.fsrs;
    const fsrsCard = this.data.card.fsrsCard;
    this.recordLog = fsrs.repeat(fsrsCard, new Date());
  }

  /**
   * Rates the card based on the user's performance in the review. The rating is
   * used to determine the next time the card should be reviewed. This is done
   * by creating a new instance of the practice card with the updated
   * parameters, and a new review log object to keep track of the learner's
   * practice history.
   *
   * @param rating The rating selected by the user, indicating how well they did
   * in the review
   * @returns The result of practicing the card, including the new card and the
   * review log
   */
  rate(rating: PracticeCardRatingModel): PracticeResultModel {
    if (!this.recordLog) throw new Error("Must practice before rate");
    const fsrsRating = new PracticeCardRatingTransformer(rating).toFsrs();
    if (fsrsRating === Rating.Manual)
      throw new Error("Manual rating is not allowed");

    const item = this.recordLog[fsrsRating];
    const newCard = item.card;

    return {
      card: new PracticeCardModel({
        id: this.data.card.id,
        courseEnrollmentId: this.data.card.courseEnrollmentId,
        note: this.data.card.note.data,

        provisionalId: this.data.card.data.provisionalId,

        due: newCard.due,
        stability: newCard.stability,
        difficulty: newCard.difficulty,
        elapsedDays: newCard.elapsed_days,
        scheduledDays: newCard.scheduled_days,
        reps: newCard.reps,
        lapses: newCard.lapses,
        lastReview: newCard.last_review,
        state: PracticeCardStateTransformer.fromFsrs(newCard.state),
      }),
      reviewLog: new ReviewLogModel({
        id: "",
        cardId: this.data.card.id,
        courseEnrollmentId: this.data.enrollment.id,

        rating: PracticeCardRatingTransformer.fromFsrs(item.log.rating),
        state: PracticeCardStateTransformer.fromFsrs(item.log.state),
        due: item.log.due,
        stability: item.log.stability,
        difficulty: item.log.difficulty,
        elapsedDays: item.log.elapsed_days,
        lastElapsedDays: item.log.last_elapsed_days,
        scheduledDays: item.log.scheduled_days,
        review: item.log.review,
      }),
    };
  }

  static readonly emptyDaysToNextReview = {
    [PracticeCardRatingModel.easy]: 0,
    [PracticeCardRatingModel.good]: 0,
    [PracticeCardRatingModel.hard]: 0,
    [PracticeCardRatingModel.again]: 0,
    [PracticeCardRatingModel.manual]: 0,
  };

  /**
   * Gets the number of days until the next review for each possible rating
   * @returns an object with the number of days until the next review for each rating
   */
  getDaysToNextReview(): DaysToNextReviewModel {
    if (!this.recordLog)
      throw new Error("Must practice before getDaysToNextReview");
    const result: DaysToNextReviewModel = PracticerModel.emptyDaysToNextReview;

    for (const key of [
      Rating.Again,
      Rating.Hard,
      Rating.Good,
      Rating.Easy,
    ] as const) {
      const domainRating = PracticeCardRatingTransformer.fromFsrs(key);
      result[domainRating] = this.recordLog[key].card.scheduled_days;
    }
    return result;
  }
}

export interface PracticeResultModel {
  card: PracticeCardModel;
  reviewLog: ReviewLogModel;
}

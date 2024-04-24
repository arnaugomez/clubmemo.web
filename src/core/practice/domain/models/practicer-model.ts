import { CourseEnrollmentModel } from "@/src/core/courses/domain/models/course-enrollment-model";
import { Rating, RecordLog } from "ts-fsrs";
import { PracticeCardModel } from "./practice-card-model";
import {
  DaysToNextReviewModel,
  PracticeCardRatingModel,
  PracticeCardRatingTransformer,
} from "./practice-card-rating-model";
import { PracticeCardStateTransformer } from "./practice-card-state-model";
import { ReviewLogModel } from "./review-log-model";

interface PracticerData {
  enrollment: CourseEnrollmentModel;
  card: PracticeCardModel;
}
export class PracticerModel {
  private recordLog?: RecordLog;
  constructor(private readonly data: PracticerData) {}

  practice() {
    const fsrs = this.data.enrollment.fsrs;
    const fsrsCard = this.data.card.fsrsCard;
    this.recordLog = fsrs.repeat(fsrsCard, new Date());
    for (const item of Object.values(this.recordLog)) {
      item.card = fsrs.reschedule([item.card])[0] ?? item.card;
    }
  }

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

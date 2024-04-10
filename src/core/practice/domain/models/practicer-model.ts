import { CourseEnrollmentModel } from "@/src/core/courses/domain/models/course-enrollment-model";
import { Rating } from "ts-fsrs";
import { PracticeCardModel } from "./practice-card-model";
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
export class PracticerModel {
  constructor(private readonly data: PracticerData) {}

  practice(rating: PracticeCardRatingModel): PracticeResultModel {
    const fsrsRating = new PracticeCardRatingTransformer(rating).toFsrs();
    if (fsrsRating === Rating.Manual)
      throw new Error("Manual rating is not allowed");
    const fsrs = this.data.enrollment.fsrs;
    const fsrsCard = this.data.card.fsrsCard;

    const reviewLog = fsrs.repeat(fsrsCard, new Date());
    const item = reviewLog[fsrsRating];

    // Apply fuzz to the card due date
    const newCard = fsrs.reschedule([item.card])[0];

    return {
      card: new PracticeCardModel({
        id: this.data.card.id,
        courseEnrollmentId: this.data.card.courseEnrollmentId,
        noteId: this.data.card.noteId,
        isNew: this.data.card.isNew,

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
}

interface PracticeResultModel {
  card: PracticeCardModel;
  reviewLog: ReviewLogModel;
}

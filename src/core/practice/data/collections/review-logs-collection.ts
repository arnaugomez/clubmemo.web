import { collection } from "@/src/core/app/utils/mongo";
import { ObjectId, WithId } from "mongodb";
import { PracticeCardRatingModel } from "../../domain/models/practice-card-rating-model";
import { PracticeCardStateModel } from "../../domain/models/practice-card-state-model";
import { ReviewLogModel } from "../../domain/models/review-log-model";

export interface ReviewLogDoc {
  cardId: ObjectId;
  courseEnrollmentId: ObjectId;

  rating: PracticeCardRatingModel;
  state: PracticeCardStateModel;
  due: Date;
  stability: number;
  difficulty: number;
  elapsedDays: number;
  lastElapsedDays: number;
  scheduledDays: number;
  review: Date;
}

export const reviewLogsCollection = collection<ReviewLogDoc>("review-logs");

export class ReviewLogDocTransformer {
  constructor(private readonly doc: WithId<ReviewLogDoc>) {}
  toDomain() {
    return new ReviewLogModel({
      id: this.doc._id.toHexString(),
      cardId: this.doc.cardId.toHexString(),
      courseEnrollmentId: this.doc.courseEnrollmentId.toHexString(),

      difficulty: this.doc.difficulty,
      due: this.doc.due,
      elapsedDays: this.doc.elapsedDays,
      lastElapsedDays: this.doc.lastElapsedDays,
      rating: this.doc.rating,
      review: this.doc.review,
      scheduledDays: this.doc.scheduledDays,
      stability: this.doc.stability,
      state: this.doc.state,
    });
  }
}

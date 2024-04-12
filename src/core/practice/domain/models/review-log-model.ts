import { PracticeCardRatingModel } from "./practice-card-rating-model";
import { PracticeCardStateModel } from "./practice-card-state-model";

export interface ReviewLogModelData {
  id: string;
  cardId: string;
  courseEnrollmentId: string;

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

export class ReviewLogModel {
  constructor(readonly data: ReviewLogModelData) {}
}

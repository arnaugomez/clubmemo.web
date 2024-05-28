import type { PracticeCardModel } from "../models/practice-card-model";

export interface PracticeCardsRepository {
  create(input: PracticeCardModel): Promise<PracticeCardModel>;
  update(input: PracticeCardModel): Promise<void>;
  getUnpracticed(input: GetUnpracticedInput): Promise<PracticeCardModel[]>;
  getDue(input: GetDueInput): Promise<PracticeCardModel[]>;
  getUnpracticedCount(courseEnrollmentId: string): Promise<number>;
}

export interface GetUnpracticedInput {
  courseId: string;
  courseEnrollmentId: string;
  limit: number;
}

export interface GetDueInput {
  courseEnrollmentId: string;
  limit: number;
}

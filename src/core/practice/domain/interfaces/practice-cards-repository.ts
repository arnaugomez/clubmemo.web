import { PracticeCardModel } from "../models/practice-card-model";

export interface GetUnpracticedInput {
  courseId: string;
  courseEnrollmentId: string;
  limit: number;
}

export interface GetDueInput {
  courseEnrollmentId: string;
  limit: number;
}

export interface PracticeCardsRepository {
  create(input: PracticeCardModel): Promise<PracticeCardModel>;
  getUnpracticed(input: GetUnpracticedInput): Promise<PracticeCardModel[]>;
  getDue(input: GetDueInput): Promise<PracticeCardModel[]>;
}

import { collection } from "@/src/core/app/utils/mongo";
import { ObjectId, WithId } from "mongodb";
import { PracticeCardModel } from "../../domain/models/practice-card-model";
import { PracticeCardStateModel } from "../../domain/models/practice-card-state-model";

export interface PracticeCardDoc {
  courseEnrollmentId: ObjectId;
  noteId: ObjectId;

  due: Date;
  stability: number;
  difficulty: number;
  elapsedDays: number;
  scheduledDays: number;
  reps: number;
  lapses: number;
  state: PracticeCardStateModel;
  lastReview?: Date;
}

export const practiceCardsCollection =
  collection<PracticeCardDoc>("practice-cards");

export class PracticeCardDocTransformer {
  constructor(private readonly doc: WithId<PracticeCardDoc>) {}
  toDomain() {
    return new PracticeCardModel({
      id: this.doc._id.toHexString(),

      isNew: false,
      courseEnrollmentId: this.doc.courseEnrollmentId.toHexString(),
      noteId: this.doc.noteId.toHexString(),

      difficulty: this.doc.difficulty,
      due: this.doc.due,
      elapsedDays: this.doc.elapsedDays,
      lapses: this.doc.lapses,
      reps: this.doc.reps,
      scheduledDays: this.doc.scheduledDays,
      stability: this.doc.stability,
      state: this.doc.state,
      lastReview: this.doc.lastReview,
    });
  }
}

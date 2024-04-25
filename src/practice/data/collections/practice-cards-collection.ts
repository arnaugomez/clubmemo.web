import { collection } from "@/src/common/data/utils/mongo";
import {
  NoteDoc,
  NoteDocTransformer,
} from "@/src/notes/data/collections/notes-collection";
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
  collection<PracticeCardDoc>("practiceCards");

export class PracticeCardDocTransformer {
  constructor(private readonly doc: WithId<PracticeCardDoc>) {}
  toDomain(note: WithId<NoteDoc>) {
    return new PracticeCardModel({
      id: this.doc._id.toString(),

      courseEnrollmentId: this.doc.courseEnrollmentId.toString(),
      note: new NoteDocTransformer(note).toDomain().data,

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

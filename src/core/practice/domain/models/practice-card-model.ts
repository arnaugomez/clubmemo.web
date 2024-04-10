import { Card, createEmptyCard } from "ts-fsrs";
import {
  PracticeCardStateModel,
  PracticeCardStateTransformer,
} from "./practice-card-state-model";

export interface PracticeCardModelData {
  id: string;

  courseEnrollmentId: string;
  noteId: string;

  isNew: boolean;

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

interface NewPracticeCardInput {
  courseEnrollmentId: string;
  noteId: string;
}

export class PracticeCardModel {
  constructor(readonly data: PracticeCardModelData) {}

  static createNew({ courseEnrollmentId, noteId }: NewPracticeCardInput) {
    const fsrsCard = createEmptyCard();
    return new PracticeCardModel({
      id: "",
      courseEnrollmentId,
      noteId,
      isNew: true,
      due: fsrsCard.due,
      stability: fsrsCard.stability,
      difficulty: fsrsCard.difficulty,
      elapsedDays: fsrsCard.elapsed_days,
      scheduledDays: fsrsCard.scheduled_days,
      reps: fsrsCard.reps,
      lapses: fsrsCard.lapses,
      state: PracticeCardStateTransformer.fromFsrs(fsrsCard.state),
      lastReview: fsrsCard.last_review,
    });
  }

  get id() {
    return this.data.id;
  }
  get courseEnrollmentId() {
    return this.data.courseEnrollmentId;
  }

  get noteId() {
    return this.data.noteId;
  }

  get isNew() {
    return this.data.isNew;
  }

  get fsrsCard(): Card {
    return {
      difficulty: this.data.difficulty,
      due: this.data.due,
      elapsed_days: this.data.elapsedDays,
      lapses: this.data.lapses,
      reps: this.data.reps,
      scheduled_days: this.data.scheduledDays,
      stability: this.data.stability,
      state: new PracticeCardStateTransformer(this.data.state).toFsrs(),
      last_review: this.data.lastReview,
    };
  }
}

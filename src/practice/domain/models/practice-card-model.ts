import type { NoteModelData } from "@/src/notes/domain/models/note-model";
import { NoteModel } from "@/src/notes/domain/models/note-model";
import type { Card } from "ts-fsrs";
import { createEmptyCard } from "ts-fsrs";
import type { PracticeCardStateModel } from "./practice-card-state-model";
import { PracticeCardStateTransformer } from "./practice-card-state-model";

export interface PracticeCardModelData {
  id: string;

  courseEnrollmentId: string;
  note: NoteModelData;

  provisionalId?: number;

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
  note: NoteModel;
  provisionalId: number;
}

/**
 * A practice card for a note.
 *
 * Practice cards keep track of the learner's progress in memorizing a certain
 * note. The card is a relationship between a note and a course enrollment. It
 * contains the data of the learner's progress, such as the next time the
 * learner should practice the note, the number of previous practices, etc.
 */
export class PracticeCardModel {
  constructor(readonly data: PracticeCardModelData) {}

  static createNew({
    courseEnrollmentId,
    note,
    provisionalId,
  }: NewPracticeCardInput) {
    const fsrsCard = createEmptyCard();
    return new PracticeCardModel({
      id: "",
      courseEnrollmentId,
      note: note.data,

      provisionalId: provisionalId + 1,

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

  get isNew() {
    return Boolean(this.data.provisionalId);
  }

  get note() {
    return new NoteModel(this.data.note);
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

import * as Schema from "effect/Schema";
import type { Card } from "ts-fsrs";
import { createEmptyCard } from "ts-fsrs";
import {
  NoteModel,
  NoteModelDataSchema,
} from "@/src/notes/domain/models/note-model";
import {
  PracticeCardStateModel,
  PracticeCardStateTransformer,
} from "./practice-card-state-model";

export const PracticeCardModelDataSchema = Schema.Struct({
  id: Schema.mutableKey(Schema.String),
  courseEnrollmentId: Schema.mutableKey(Schema.String),
  note: Schema.mutableKey(NoteModelDataSchema),
  provisionalId: Schema.mutableKey(Schema.optional(Schema.Number)),
  due: Schema.mutableKey(Schema.Date),
  stability: Schema.mutableKey(Schema.Number),
  difficulty: Schema.mutableKey(Schema.Number),
  elapsedDays: Schema.mutableKey(Schema.Number),
  scheduledDays: Schema.mutableKey(Schema.Number),
  reps: Schema.mutableKey(Schema.Number),
  lapses: Schema.mutableKey(Schema.Number),
  state: Schema.mutableKey(Schema.Enum(PracticeCardStateModel)),
  lastReview: Schema.mutableKey(Schema.optional(Schema.Date)),
});
export type PracticeCardModelData = typeof PracticeCardModelDataSchema.Type;

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
export class PracticeCardModel extends Schema.Class<PracticeCardModel>(
  "PracticeCardModel",
)({ data: PracticeCardModelDataSchema }) {
  constructor(data: PracticeCardModelData) {
    super({ data });
  }

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

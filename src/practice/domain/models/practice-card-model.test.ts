import type { NoteModelData } from "@/src/notes/domain/models/note-model";
import { NoteModel } from "@/src/notes/domain/models/note-model";
import { State } from "ts-fsrs";
import { describe, expect, it } from "vitest";
import type { PracticeCardModelData } from "./practice-card-model";
import { PracticeCardModel } from "./practice-card-model";
import { PracticeCardStateModel } from "./practice-card-state-model";

describe("PracticeCardModel", () => {
  const data: PracticeCardModelData = {
    id: "id",
    courseEnrollmentId: "courseEnrollmentId",
    note: {} as NoteModelData,
    provisionalId: 123,
    due: new Date(),
    stability: 234,
    difficulty: 567,
    elapsedDays: 89,
    scheduledDays: 12,
    reps: 66,
    lapses: 990,
    state: PracticeCardStateModel.learning,
    lastReview: new Date(),
  };
  const practiceCardModel = new PracticeCardModel(data);

  it("properties match data", () => {
    expect(practiceCardModel.id).toBe(data.id);
    expect(practiceCardModel.courseEnrollmentId).toBe(data.courseEnrollmentId);
  });

  it("isNew is true if card has a provisional id", () => {
    const withId = new PracticeCardModel({ ...data, provisionalId: 223 });
    const withoutId = new PracticeCardModel({
      ...data,
      provisionalId: undefined,
    });

    expect(withId.isNew).toBe(true);
    expect(withoutId.isNew).toBe(false);
  });

  it("note returns a NoteModel", () => {
    expect(practiceCardModel.note).toBeInstanceOf(NoteModel);
  });

  it("fsrsCard returns a Card of the FSRS algorithm with the correct data", () => {
    const fsrsCard = practiceCardModel.fsrsCard;
    expect(fsrsCard.difficulty).toBe(data.difficulty);
    expect(fsrsCard.due).toBe(data.due);
    expect(fsrsCard.elapsed_days).toBe(data.elapsedDays);
    expect(fsrsCard.stability).toBe(data.stability);
    expect(fsrsCard.scheduled_days).toBe(data.scheduledDays);
    expect(fsrsCard.reps).toBe(data.reps);
    expect(fsrsCard.lapses).toBe(data.lapses);
    expect(fsrsCard.state).toBe(State.Learning);
    expect(fsrsCard.last_review).toBe(data.lastReview);
  });
});

import { State } from "ts-fsrs";
import { describe, expect, it } from "vitest";
import {
  PracticeCardStateModel,
  PracticeCardStateTransformer,
} from "./practice-card-state-model";

describe("PracticeCardStateModel", () => {
  it("enum values match string values", () => {
    expect(PracticeCardStateModel.learning).toBe("learning");
    expect(PracticeCardStateModel.new).toBe("new");
    expect(PracticeCardStateModel.relearning).toBe("relearning");
    expect(PracticeCardStateModel.review).toBe("review");
  });
});

describe("PracticeCardStateTransformer", () => {
  it("toFsrs transforms a domain model to the FSRS model", () => {
    expect(
      new PracticeCardStateTransformer(
        PracticeCardStateModel.learning,
      ).toFsrs(),
    ).toBe(State.Learning);
    expect(
      new PracticeCardStateTransformer(PracticeCardStateModel.new).toFsrs(),
    ).toBe(State.New);
    expect(
      new PracticeCardStateTransformer(
        PracticeCardStateModel.relearning,
      ).toFsrs(),
    ).toBe(State.Relearning);
    expect(
      new PracticeCardStateTransformer(PracticeCardStateModel.review).toFsrs(),
    ).toBe(State.Review);
  });

  it("fromFsrs transforms an FSRS model to the domain model", () => {
    expect(PracticeCardStateTransformer.fromFsrs(State.Learning)).toBe(
      PracticeCardStateModel.learning,
    );
    expect(PracticeCardStateTransformer.fromFsrs(State.New)).toBe(
      PracticeCardStateModel.new,
    );
    expect(PracticeCardStateTransformer.fromFsrs(State.Relearning)).toBe(
      PracticeCardStateModel.relearning,
    );
    expect(PracticeCardStateTransformer.fromFsrs(State.Review)).toBe(
      PracticeCardStateModel.review,
    );
  });
});

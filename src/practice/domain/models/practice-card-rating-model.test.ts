import { Rating } from "ts-fsrs";
import { describe, expect, it } from "vitest";
import {
  PracticeCardRatingModel,
  PracticeCardRatingTransformer,
} from "./practice-card-rating-model";

describe("PracticeCardRatingModel", () => {
  it("enum values match string values", () => {
    expect(PracticeCardRatingModel.easy).toBe("easy");
    expect(PracticeCardRatingModel.good).toBe("good");
    expect(PracticeCardRatingModel.hard).toBe("hard");
    expect(PracticeCardRatingModel.again).toBe("again");
    expect(PracticeCardRatingModel.manual).toBe("manual");
  });

  it("", () => {
    expect(PracticeCardRatingModel.easy).toBe("easy");
    expect(PracticeCardRatingModel.good).toBe("good");
    expect(PracticeCardRatingModel.hard).toBe("hard");
    expect(PracticeCardRatingModel.again).toBe("again");
    expect(PracticeCardRatingModel.manual).toBe("manual");
  });
});

describe("PracticeCardRatingTransformer", () => {
  it("toFsrs transforms a domain model to the FSRS model", () => {
    expect(
      new PracticeCardRatingTransformer(PracticeCardRatingModel.again).toFsrs(),
    ).toBe(Rating.Again);
    expect(
      new PracticeCardRatingTransformer(PracticeCardRatingModel.hard).toFsrs(),
    ).toBe(Rating.Hard);
    expect(
      new PracticeCardRatingTransformer(PracticeCardRatingModel.good).toFsrs(),
    ).toBe(Rating.Good);
    expect(
      new PracticeCardRatingTransformer(PracticeCardRatingModel.easy).toFsrs(),
    ).toBe(Rating.Easy);
    expect(
      new PracticeCardRatingTransformer(
        PracticeCardRatingModel.manual,
      ).toFsrs(),
    ).toBe(Rating.Manual);
  });

  it("fromFsrs transforms an FSRS model to the domain model", () => {
    expect(PracticeCardRatingTransformer.fromFsrs(Rating.Again)).toBe(
      PracticeCardRatingModel.again,
    );
    expect(PracticeCardRatingTransformer.fromFsrs(Rating.Hard)).toBe(
      PracticeCardRatingModel.hard,
    );
    expect(PracticeCardRatingTransformer.fromFsrs(Rating.Good)).toBe(
      PracticeCardRatingModel.good,
    );
    expect(PracticeCardRatingTransformer.fromFsrs(Rating.Easy)).toBe(
      PracticeCardRatingModel.easy,
    );
    expect(PracticeCardRatingTransformer.fromFsrs(Rating.Manual)).toBe(
      PracticeCardRatingModel.manual,
    );
  });
});

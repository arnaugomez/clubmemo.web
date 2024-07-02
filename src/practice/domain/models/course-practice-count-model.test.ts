import { describe, expect, it } from "vitest";
import {
  CoursePracticeCountModel,
  type CoursePracticeCountModelData,
} from "./course-practice-count-model";

describe("CoursePracticeCountModel", () => {
  const data: CoursePracticeCountModelData = {
    newCount: 28,
    dueCount: 79,
  };
  const emptyData: CoursePracticeCountModelData = {
    newCount: 0,
    dueCount: 0,
  };

  const model = new CoursePracticeCountModel(data);
  const emptyModel = new CoursePracticeCountModel(emptyData);

  it("properties match data", () => {
    expect(model.newCount).toBe(data.newCount);
    expect(model.dueCount).toBe(data.dueCount);
    expect(emptyModel.newCount).toBe(emptyData.newCount);
    expect(emptyModel.dueCount).toBe(emptyData.dueCount);
  });

  it("shouldPractice is true if newCount > 0 or dueCount > 0", () => {
    const modelWithNewCount = new CoursePracticeCountModel({
      newCount: 0,
      dueCount: 1,
    });
    const modelWithDueCount = new CoursePracticeCountModel({
      newCount: 1,
      dueCount: 0,
    });

    expect(model.shouldPractice).toBe(true);
    expect(modelWithNewCount.shouldPractice).toBe(true);
    expect(modelWithDueCount.shouldPractice).toBe(true);
    expect(emptyModel.shouldPractice).toBe(false);
  });
});

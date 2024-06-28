import { describe, expect, it } from "vitest";
import { KeepLearningModel } from "./keep-learning-model";

describe("KeepLearningModel", () => {
  const data = {
    courseId: "course-23",
    name: "Test Course 23",
    description: "Test Course Description 23",
    picture: "https://example.com/picture.jpg",
    tags: ["maths", "science", "biology", "ethics"],
    dueCount: 5,
    newCount: 3,
  };

  const model = new KeepLearningModel(data);

  it("properties match data", () => {
    expect(model.courseId).toEqual(data.courseId);
    expect(model.name).toEqual(data.name);
    expect(model.description).toEqual(data.description);
    expect(model.picture).toEqual(data.picture);
    expect(model.tags).toEqual(data.tags);
    expect(model.dueCount).toEqual(data.dueCount);
    expect(model.newCount).toEqual(data.newCount);
  });

  describe("shouldPractice", () => {
    it("returns true when newCount = 0 and dueCount > 0", () => {
      const newData = { ...data, newCount: 0, dueCount: 785 };
      const newModel = new KeepLearningModel(newData);
      expect(newModel.shouldPractice).toBe(true);
    });
    it("returns true when newCount > 0 and dueCount is 0", () => {
      const newData = { ...data, dueCount: 0 };
      const newModel = new KeepLearningModel(newData);
      expect(newModel.shouldPractice).toBe(true);
    });

    it("returns false when both dueCount and newCount are 0", () => {
      const newData = { ...data, dueCount: 0, newCount: 0 };
      const newModel = new KeepLearningModel(newData);
      expect(newModel.shouldPractice).toBe(false);
    });
  });
});

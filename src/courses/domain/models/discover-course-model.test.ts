import { describe, expect, it } from "vitest";
import type { DiscoverCourseModelData } from "./discover-course-model";
import { DiscoverCourseModel } from "./discover-course-model";

describe("DiscoverCourseModel", () => {
  const data: DiscoverCourseModelData = {
    id: "test-course-7554",
    name: "Test Course 7554",
    description: "Test course description 7554",
    picture: "https://example.com/picture.jpg",
    tags: ["chemistry", "technology", "science"],
  };
  const model = new DiscoverCourseModel(data);

  it("properties match data", () => {
    expect(model.id).toBe(data.id);
    expect(model.name).toBe(data.name);
    expect(model.description).toBe(data.description);
    expect(model.picture).toBe(data.picture);
    expect(model.tags).toEqual(data.tags);
  });

  it("tags returns an empty array if not present in data", () => {
    const modelWithoutTags = new DiscoverCourseModel({ id: "1", name: "Test" });
    expect(modelWithoutTags.tags).toEqual([]);
  });
});

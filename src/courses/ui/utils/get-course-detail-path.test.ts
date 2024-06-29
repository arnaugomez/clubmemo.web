import { describe, expect, it } from "vitest";
import { getCourseDetailPath } from "./get-course-detail-path";

describe("getCourseDetailPath", () => {
  it("returns the path", () => {
    const courseId = "test-id-0007";
    const path = getCourseDetailPath(courseId);
    expect(path).toBe(`/courses/detail/${courseId}`);
  });
  it("throws error if id is empty", () => {
    expect(() => getCourseDetailPath("")).toThrowError(Error);
  });
});

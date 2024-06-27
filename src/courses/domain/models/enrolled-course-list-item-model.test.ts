import { describe, expect, it } from "vitest";
import type { EnrolledCourseListItemModelData } from "./enrolled-course-list-item-model";
import { EnrolledCourseListItemModel } from "./enrolled-course-list-item-model";

describe("EnrolledCourseListItemModel", () => {
  const mockCourseData: EnrolledCourseListItemModelData = {
    courseId: "course123",
    name: "Test Course",
    picture: "https://example.com/picture.jpg",
    isFavorite: true,
    dueCount: 36,
    newCount: 890,
  };
  const course = new EnrolledCourseListItemModel(mockCourseData);

  it("courseId matches data", () => {
    expect(course.courseId).toBe(mockCourseData.courseId);
  });

  it("name matches data", () => {
    expect(course.name).toBe(mockCourseData.name);
  });

  it("picture matches data", () => {
    expect(course.picture).toBe(mockCourseData.picture);
  });

  it("isFavorite matches data", () => {
    expect(course.isFavorite).toBe(mockCourseData.isFavorite);
  });

  it("dueCount matches data", () => {
    expect(course.dueCount).toBe(mockCourseData.dueCount);
  });

  it("newCount matches data", () => {
    expect(course.newCount).toBe(mockCourseData.newCount);
  });

  describe("shouldPractice", () => {
    it("returns true if dueCount > 0", () => {
      const dataWithDue = { ...mockCourseData, dueCount: 1, newCount: 0 };
      const courseWithDue = new EnrolledCourseListItemModel(dataWithDue);
      expect(courseWithDue.shouldPractice).toBe(true);
    });

    it("returns true if newCount > 0", () => {
      const dataWithNew = { ...mockCourseData, dueCount: 0, newCount: 1 };
      const courseWithNew = new EnrolledCourseListItemModel(dataWithNew);
      expect(courseWithNew.shouldPractice).toBe(true);
    });

    it("returns false if both dueCount = 0 and newCount = 0", () => {
      const dataWithNone = { ...mockCourseData, dueCount: 0, newCount: 0 };
      const courseWithNone = new EnrolledCourseListItemModel(dataWithNone);
      expect(courseWithNone.shouldPractice).toBe(false);
    });
  });
});

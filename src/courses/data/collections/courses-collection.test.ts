import { ObjectId } from "mongodb";
import { describe, expect, it } from "vitest";
import { CoursePermissionTypeModel } from "../../domain/models/course-permission-type-model";
import { CourseDocTransformer } from "/Users/arnau/Desktop/pfg/clubmemo.web/src/courses/data/collections/courses-collection";
import { CourseModel } from "/Users/arnau/Desktop/pfg/clubmemo.web/src/courses/domain/models/course-model";

const courseId = new ObjectId();

// Mock data
const mockCourseDoc = {
  name: "Test Course",
  description: "A test course",
  picture: "test.jpg",
  isPublic: true,
  tags: ["test", "course"],
};

const mockEnrollmentDoc = {
  courseId: new ObjectId(),
  profileId: new ObjectId(),
  isFavorite: false,
};

describe("CourseDocTransformer", () => {
  it("the values of the domain model match the values of the data model", () => {
    const transformer = new CourseDocTransformer({
      ...mockCourseDoc,
      _id: courseId,
    });
    const result = transformer.toDomain(CoursePermissionTypeModel.own, {
      ...mockEnrollmentDoc,
      _id: courseId,
    });
    expect(result).toBeInstanceOf(CourseModel);
    expect(result.id).toBe(courseId.toString());
    expect(result.name).toBe("Test Course");
    expect(result.description).toBe("A test course");
    expect(result.picture).toBe("test.jpg");
    expect(result.isPublic).toBe(true);
    expect(result.tags).toEqual(["test", "course"]);
    expect(result.permissionType).toBe(CoursePermissionTypeModel.own);
  });

  it("the values of the domain model match the values of the data model when the course does not have an enrollment", () => {
    const transformer = new CourseDocTransformer({
      _id: courseId,
      name: "Minimal Course",
      isPublic: false,
    });
    const result = transformer.toDomain(null, null);
    expect(result).toBeInstanceOf(CourseModel);
    expect(result.id).toBe(courseId.toString());
    expect(result.name).toBe("Minimal Course");
    expect(result.description).toBeUndefined();
    expect(result.picture).toBeUndefined();
    expect(result.isPublic).toBe(false);
    expect(result.tags).toEqual([]);
    expect(result.permissionType).toBeNull();
    expect(result.enrollment).toBeNull();
  });

  it("transforms the databse id from a MongoDB ObjectId to to a string", () => {
    const transformer = new CourseDocTransformer({
      _id: courseId,
      name: "ID Test",
      isPublic: true,
    });
    const result = transformer.toDomain(null, null);
    expect(result.id).toBe(courseId.toString());
  });
});

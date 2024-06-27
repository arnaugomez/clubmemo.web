import { describe, expect, it } from "vitest";
import type { CourseModelData } from "./course-model";
import { CourseModel } from "./course-model";
import { CoursePermissionTypeModel } from "./course-permission-type-model";

describe("CourseModel", () => {
  const mockData: CourseModelData = {
    id: "course-123",
    name: "Test Course",
    description: "A course for testing",
    picture: "https://example.com/picture.jpg",
    isPublic: true,
    permissionType: CoursePermissionTypeModel.own,
    enrollment: null,
    tags: ["maths", "science", "english"],
  };

  it("should have getters that match the data values", () => {
    const course = new CourseModel(mockData);
    expect(course.id).toBe(mockData.id);
    expect(course.name).toBe(mockData.name);
    expect(course.description).toBe(mockData.description);
    expect(course.picture).toBe(mockData.picture);
    expect(course.isPublic).toBe(mockData.isPublic);
    expect(course.permissionType).toBe(mockData.permissionType);
    expect(course.tags).toEqual(mockData.tags);
    expect(course.canView).toBe(true);
    expect(course.canEdit).toBe(true);
    expect(course.canDelete).toBe(true);
    expect(course.isOwner).toBe(true);
    expect(course.enrollment).toBeNull();
    expect(course.isEnrolled).toBe(false);
  });

  it("canDelete is true only if permissionType is own", () => {
    const courseOwner = new CourseModel({
      ...mockData,
      permissionType: CoursePermissionTypeModel.own,
    });
    expect(courseOwner.canDelete).toBe(true);

    const course2 = new CourseModel({
      ...mockData,
      permissionType: CoursePermissionTypeModel.edit,
    });
    expect(course2.canDelete).toBe(false);

    const course3 = new CourseModel({
      ...mockData,
      permissionType: CoursePermissionTypeModel.edit,
    });
    expect(course3.canDelete).toBe(false);
  });

  it("canView is true if course is public or if permissionType is not undefined", () => {
    const course1 = new CourseModel({
      ...mockData,
      permissionType: undefined,
      isPublic: true,
    });
    expect(course1.canView).toBe(true);

    const course2 = new CourseModel({
      ...mockData,
      isPublic: false,
      permissionType: CoursePermissionTypeModel.own,
    });
    expect(course2.canView).toBe(true);

    const course3 = new CourseModel({
      ...mockData,
      isPublic: false,
      permissionType: CoursePermissionTypeModel.edit,
    });
    expect(course3.canView).toBe(true);

    const course4 = new CourseModel({
      ...mockData,
      isPublic: false,
      permissionType: CoursePermissionTypeModel.view,
    });
    expect(course4.canView).toBe(true);

    const course5 = new CourseModel({
      ...mockData,
      isPublic: false,
      permissionType: undefined,
    });
    expect(course5.canView).toBe(false);
  });

  it("canEdit is true only if permissionType is edit or own", () => {
    const courseWithOwnPermission = new CourseModel({
      ...mockData,
      permissionType: CoursePermissionTypeModel.own,
    });
    expect(courseWithOwnPermission.canEdit).toBe(true);

    const courseWithEditPermission = new CourseModel({
      ...mockData,
      permissionType: CoursePermissionTypeModel.edit,
    });
    expect(courseWithEditPermission.canEdit).toBe(true);

    const courseWithViewPermission = new CourseModel({
      ...mockData,
      permissionType: CoursePermissionTypeModel.view,
    });
    expect(courseWithViewPermission.canEdit).toBe(false);

    const courseWithNoPermission = new CourseModel({
      ...mockData,
      permissionType: undefined,
    });
    expect(courseWithNoPermission.canEdit).toBe(false);
  });

  it("isEnrolled is true if course has enrollment", () => {
    const notEnrolledCourse = new CourseModel(mockData);
    expect(notEnrolledCourse.isEnrolled).toBe(false);

    const enrolledData: CourseModelData = {
      ...mockData,
      enrollment: {
        id: "",
        profileId: "",
        courseId: "course-123",
        isFavorite: false,
      },
    };
    const enrolledCourse = new CourseModel(enrolledData);
    expect(enrolledCourse.isEnrolled).toBe(true);
  });
});

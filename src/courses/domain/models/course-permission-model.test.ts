import { describe, expect, it } from "vitest";
import {
  CoursePermissionModel,
  type CoursePermissionModelData,
} from "./course-permission-model";
import { CoursePermissionTypeModel } from "./course-permission-type-model";

describe("CoursePermissionModel", () => {
  const data: CoursePermissionModelData = {
    id: "1",
    courseId: "test-course-id",
    profileId: "3",
    permissionType: CoursePermissionTypeModel.edit,
  };
  const model = new CoursePermissionModel(data);

  it("properties match data", () => {
    expect(model.id).toBe(data.id);
    expect(model.courseId).toBe(data.courseId);
    expect(model.profileId).toBe(data.profileId);
    expect(model.permissionType).toBe(data.permissionType);
  });
});

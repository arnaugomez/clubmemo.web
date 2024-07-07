import { describe, expect, it } from "vitest";
import {
  CourseAuthorModel,
  type CourseAuthorModelData,
} from "./course-author-model";
import { CoursePermissionTypeModel } from "./course-permission-type-model";

const data: CourseAuthorModelData = {
  courseId: "courseId",
  permissionType: CoursePermissionTypeModel.own,
  profileId: "profileId",
  displayName: "displayName",
  picture: "picture",
  handle: "handle",
};

const model = new CourseAuthorModel(data);

describe("CourseAuthorModel", () => {
  it("getters match data", () => {
    expect(model.courseId).toBe(data.courseId);
    expect(model.permissionType).toBe(data.permissionType);
    expect(model.profileId).toBe(data.profileId);
    expect(model.displayName).toBe(data.displayName);
    expect(model.picture).toBe(data.picture);
    expect(model.handle).toBe(data.handle);
  });
});

import { describe } from "node:test";
import { expect, it } from "vitest";
import { CoursePermissionTypeModel } from "./course-permission-type-model";

describe("CoursePermissionTypeModel", () => {
  it("enum type name should match string value", () => {
    expect(CoursePermissionTypeModel.own).toBe("own");
    expect(CoursePermissionTypeModel.edit).toBe("edit");
    expect(CoursePermissionTypeModel.view).toBe("view");
  });
});

import { describe, expect, it } from "vitest";
import { getProfilePagePath } from "./get-profile-page-path";

describe("getProfilePagePath", () => {
  it("returns path with id when handle is undefined", () => {
    const path = getProfilePagePath({ id: "test-id-9" });
    expect(path).toBe("/profile/id/test-id-9");
  });

  it("returns path with handle when handle is not undefined", () => {
    const path = getProfilePagePath({ handle: "test_user_128", id: "" });
    expect(path).toBe("/profile/test_user_128");
  });

  it("returns path with handle when handle and id are not undefined", () => {
    const path = getProfilePagePath({
      handle: "test_user_128",
      id: "test-id-9",
    });
    expect(path).toBe("/profile/test_user_128");
  });
});

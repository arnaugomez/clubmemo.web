import { describe, expect, it } from "vitest";
import { AuthTypeModel } from "./auth-type-model";

describe("AuthTypeModel", () => {
  it("should have the email type of string value", () => {
    expect(AuthTypeModel.email).toBe("email");
  });
});

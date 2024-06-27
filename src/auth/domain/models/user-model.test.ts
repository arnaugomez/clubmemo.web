import { describe, expect, it } from "vitest";
import { AuthTypeModel } from "./auth-type-model";
import type { UserModelData } from "./user-model";
import { UserModel } from "./user-model";

describe("UserModel", () => {
  const mockData: UserModelData = {
    id: "user-123",
    email: "test@example.com",
    authTypes: [AuthTypeModel.email],
    isEmailVerified: true,
  };

  it("should instantiate correctly with provided data", () => {
    const user = new UserModel(mockData);
    expect(user).toBeInstanceOf(UserModel);
  });

  it("should have getters id, email and authTypes and isEmailVerified that match the values of the constructor argument", () => {
    const user = new UserModel(mockData);
    expect(user.id).toBe(mockData.id);
    expect(user.email).toBe(mockData.email);
    expect(user.authTypes).toEqual(mockData.authTypes);
    expect(user.isEmailVerified).toBe(mockData.isEmailVerified);
  });

  it("isEmailVerified should be false if the data value is undefined", () => {
    const userDataWithoutEmailVerification = {
      ...mockData,
      isEmailVerified: undefined,
    };
    const user = new UserModel(userDataWithoutEmailVerification);
    expect(user.isEmailVerified).toBe(false);
  });

  it("isEmailVerified should be false if the data value is false", () => {
    const userDataWithEmailVerificationFalse = {
      ...mockData,
      isEmailVerified: false,
    };
    const user = new UserModel(userDataWithEmailVerificationFalse);
    expect(user.isEmailVerified).toBe(false);
  });
});

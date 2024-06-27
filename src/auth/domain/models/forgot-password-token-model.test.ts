import { describe, expect, it } from "vitest";
import { ForgotPasswordTokenModel } from "./forgot-password-token-model";

describe("ForgotPasswordTokenModel", () => {
  it("userId matches data", () => {
    const userId = "test_user_234";
    const tokenModel = new ForgotPasswordTokenModel({
      userId,
      expiresAt: new Date(),
    });
    expect(tokenModel.userId).toBe(userId);
  });

  describe("hasExpired", () => {
    it("should return false if expiresAt is later than now", () => {
      const futureDate = new Date(Date.now() + 1000 * 60 * 60); // 1 hour later
      const tokenModel = new ForgotPasswordTokenModel({
        userId: "test_user_1",
        expiresAt: futureDate,
      });
      expect(tokenModel.hasExpired).toBe(false);
    });

    it("should return true if expiresAt is before now", () => {
      const pastDate = new Date(Date.now() - 1000 * 60 * 60); // 1 hour before
      const tokenModel = new ForgotPasswordTokenModel({
        userId: "test_user_1",
        expiresAt: pastDate,
      });
      expect(tokenModel.hasExpired).toBe(true);
    });
  });
});
import { describe, expect, it } from "vitest";
import type { EmailVerificationCodeModelData } from "./email-verification-code-model";
import { EmailVerificationCodeModel } from "./email-verification-code-model";

const codeModelData: EmailVerificationCodeModelData = {
  userId: "test_user_1",
  code: "123456",
  expiresAt: new Date(),
};
const codeModel = new EmailVerificationCodeModel(codeModelData);

describe("EmailVerificationCodeModel", () => {
  it("userId matches data", () => {
    expect(codeModel.userId).toBe(codeModelData.userId);
  });

  it("code matches data", () => {
    expect(codeModel.code).toBe(codeModelData.code);
  });

  describe("hasExpired", () => {
    it("should return false if expiresAt is later than now", () => {
      const futureDate = new Date(Date.now() + 1000 * 60 * 60); // 1 hour later
      const codeModel = new EmailVerificationCodeModel({
        ...codeModelData,
        expiresAt: futureDate,
      });
      expect(codeModel.hasExpired).toBe(false);
    });

    it("should return true if expiresAt is before now", () => {
      const pastDate = new Date(Date.now() - 1000 * 60 * 60); // 1 hour before
      const codeModel = new EmailVerificationCodeModel({
        ...codeModelData,
        expiresAt: pastDate,
      });
      expect(codeModel.hasExpired).toBe(true);
    });
  });
});

import type { EmailVerificationCodeModel } from "../models/email-verification-code-model";

/**
 * Repository for email verification codes The email verification codes are used
 * to verify the email of a user before it can have complete access to the platform
 */
export interface EmailVerificationCodesRepository {
  /**
   * Creates a new email verification code for the user
   *
   * @param userId Id of the user
   */
  generate(userId: string): Promise<EmailVerificationCodeModel>;
  /**
   * Gets the current email verification code for a given user
   *
   * @param userId Id of the user
   */
  getByUserId(userId: string): Promise<EmailVerificationCodeModel | null>;
  /**
   * Check that the code is valid for the user
   *
   * @param userId Id of the user
   * @param code code to verify
   */
  verify(userId: string, code: string): Promise<boolean>;
}

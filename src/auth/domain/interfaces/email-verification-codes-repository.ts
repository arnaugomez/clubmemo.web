import * as Context from "effect/Context";
import type * as Effect from "effect/Effect";
import type { ExternalServiceError } from "@/src/common/effect/errors";
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
  generate(
    userId: string,
  ): Effect.Effect<EmailVerificationCodeModel, ExternalServiceError>;
  /**
   * Gets the current email verification code for a given user
   *
   * @param userId Id of the user
   */
  getByUserId(
    userId: string,
  ): Effect.Effect<EmailVerificationCodeModel | null, ExternalServiceError>;
  /**
   * Check that the code is valid for the user
   *
   * @param userId Id of the user
   * @param code code to verify
   */
  verify(
    userId: string,
    code: string,
  ): Effect.Effect<boolean, ExternalServiceError>;
}

export const EmailVerificationCodesRepository =
  Context.Service<EmailVerificationCodesRepository>(
    "clubmemo/auth/domain/interfaces/email-verification-codes-repository/EmailVerificationCodesRepository",
  );

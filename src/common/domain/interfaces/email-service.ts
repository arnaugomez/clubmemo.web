import * as Context from "effect/Context";
import type * as Effect from "effect/Effect";
import type { ExternalServiceError } from "@/src/common/effect/errors";
/**
 * Service to send automated emails
 */
export interface EmailService {
  /**
   * Sends a verification code to the user's email.
   * The verification code is used to verify the user's email and grant
   * access to the rest of the application.
   *
   * @param email The email of the user
   * @param verificationCode The verification code to send
   */
  sendVerificationCode(
    email: string,
    verificationCode: string,
  ): Effect.Effect<void, ExternalServiceError>;

  /**
   * Sends an email with a link to reset the user's password.
   *
   * @param email The email of the user
   * @param token The 'forgot password' token used to generate the reset password link
   */
  sendForgotPasswordLink(
    email: string,
    token: string,
  ): Effect.Effect<void, ExternalServiceError>;
}

export const EmailService = Context.Service<EmailService>(
  "clubmemo/common/domain/interfaces/email-service/EmailService",
);

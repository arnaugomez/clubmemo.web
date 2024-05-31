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
  sendVerificationCode(email: string, verificationCode: string): Promise<void>;

  /**
   * Sends an email with a link to reset the user's password.
   *
   * @param email The email of the user
   * @param token The 'forgot password' token used to generate the reset password link
   */
  sendForgotPasswordLink(email: string, token: string): Promise<void>;
}

export interface EmailService {
  sendVerificationCode(email: string, verificationCode: string): Promise<void>;

  sendForgotPasswordCode(
    email: string,
    forgotPasswordCode: string,
  ): Promise<void>;
}

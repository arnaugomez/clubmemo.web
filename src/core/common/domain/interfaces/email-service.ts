export interface EmailService {
  sendVerificationCode(email: string, verificationCode: string): Promise<void>;

  sendForgotPasswordLink(email: string, token: string): Promise<void>;
}

export interface EmailService {
  sendVerificationCode(email: string, verificationCode: string): Promise<void>;
}

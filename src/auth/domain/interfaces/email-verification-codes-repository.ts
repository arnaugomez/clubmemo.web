import type { EmailVerificationCodeModel } from "../models/email-verification-code-model";

export interface EmailVerificationCodesRepository {
  generate(userId: string): Promise<EmailVerificationCodeModel>;
  getByUserId(userId: string): Promise<EmailVerificationCodeModel | null>;
  verify(userId: string, code: string): Promise<boolean>;
}

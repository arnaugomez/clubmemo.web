import { ObjectId } from "mongodb";
import { EmailVerificationCodeModel } from "../models/email-verification-code-model";

export interface EmailVerificationCodesRepository {
  generate(userId: ObjectId): Promise<EmailVerificationCodeModel>;
  getByUserId(userId: ObjectId): Promise<EmailVerificationCodeModel | null>;
  verify(userId: ObjectId, code: string): Promise<boolean>;
}

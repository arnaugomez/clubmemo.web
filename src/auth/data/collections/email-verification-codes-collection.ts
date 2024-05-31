import { collection } from "@/src/common/data/utils/mongo";
import type { ObjectId } from "mongodb";
import { EmailVerificationCodeModel } from "../../domain/models/email-verification-code-model";

/**
 * MongoDB document for email verification codes. These codes are used to verify
 * the email of a user before it can have full access to the platform.
 */
export interface EmailVerificationCodeDoc {
  /** Id of the user */
  userId: ObjectId;
  /** Email verification code or token */
  code: string;
  /** Expiration date of the token */
  expiresAt: Date;
}

/**
 * Collection of MongoDB documents of type `EmailVerificationCodeDoc`
 */
export const emailVerificationCodesCollection =
  collection<EmailVerificationCodeDoc>("emailVerificationCodes");

export class EmailVerificationCodeDocTransformer {
  constructor(private readonly doc: EmailVerificationCodeDoc) {}

  toDomain(): EmailVerificationCodeModel {
    return new EmailVerificationCodeModel({
      code: this.doc.code,
      expiresAt: this.doc.expiresAt,
      userId: this.doc.userId.toString(),
    });
  }
}

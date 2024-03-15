import { collection } from "@/src/core/app/utils/mongo";
import { ObjectId } from "mongodb";
import { EmailVerificationCodeModel } from "../../domain/models/email-verification-code-model";

export interface EmailVerificationCodeDoc {
  userId: ObjectId;
  code: string;
  expiresAt: Date;
}

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

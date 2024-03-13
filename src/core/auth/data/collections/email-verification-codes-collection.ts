import { collection } from "@/src/core/app/utils/mongo";
import { ObjectId } from "mongodb";

export interface EmailVerificationCodeDoc {
  userId: ObjectId;
  code: string;
  expiresAt: Date;
}

export const emailVerificationCodesCollection =
  collection<EmailVerificationCodeDoc>("emailVerificationCodes");

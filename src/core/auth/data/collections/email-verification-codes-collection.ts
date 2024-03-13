import { db } from "@/src/core/app/data/services/mongodb-service-impl";
import { ObjectId } from "mongodb";

interface EmailVerificationCodeDoc {
  userId: ObjectId;
  code: string;
  expiresAt: Date;
}

export const emailVerificationCodesCollection =
  db.collection<EmailVerificationCodeDoc>("emailVerificationCodes");

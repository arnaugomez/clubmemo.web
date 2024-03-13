import { locator } from "@/src/core/app/locator";
import { ObjectId } from "mongodb";

interface EmailVerificationCodeDoc {
  userId: ObjectId;
  code: string;
  expiresAt: Date;
}

const db = locator.MongoService().db;
export const emailVerificationCodesCollection =
  db.collection<EmailVerificationCodeDoc>("emailVerificationCodes");

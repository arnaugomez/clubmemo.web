import { collection } from "@/src/core/app/utils/mongo";
import { ObjectId } from "mongodb";

export interface ForgotPasswordTokenDoc {
  userId: ObjectId;
  tokenHash: string;
  expiresAt: Date;
}

export const forgotPasswordTokensCollection =
  collection<ForgotPasswordTokenDoc>("forgotPasswordTokens");

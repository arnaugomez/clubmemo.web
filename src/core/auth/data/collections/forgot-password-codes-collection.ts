import { collection } from "@/src/core/app/utils/mongo";
import { ObjectId } from "mongodb";

export interface ForgotPasswordCodeDoc {
  userId: ObjectId;
  code: string;
  expiresAt: Date;
}

export const forgotPasswordCodesCollection = collection<ForgotPasswordCodeDoc>(
  "forgotPasswordCodes",
);

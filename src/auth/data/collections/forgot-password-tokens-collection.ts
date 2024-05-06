import { collection } from "@/src/common/data/utils/mongo";
import type { ObjectId, WithId } from "mongodb";
import { ForgotPasswordTokenModel } from "../../domain/models/forgot-password-token-model";

export interface ForgotPasswordTokenDoc {
  userId: ObjectId;
  tokenHash: string;
  expiresAt: Date;
}

export const forgotPasswordTokensCollection =
  collection<ForgotPasswordTokenDoc>("forgotPasswordTokens");

export class ForgotPasswordTokenDocTransformer {
  constructor(private readonly doc: WithId<ForgotPasswordTokenDoc>) {}

  toDomain(): ForgotPasswordTokenModel {
    return new ForgotPasswordTokenModel({
      userId: this.doc.userId.toString(),
      expiresAt: this.doc.expiresAt,
    });
  }
}

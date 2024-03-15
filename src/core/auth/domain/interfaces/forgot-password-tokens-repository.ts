import { ObjectId } from "mongodb";
import { ForgotPasswordTokenModel } from "../models/forgot-password-token-model";

export interface ForgotPasswordTokensRepository {
  generate(userId: ObjectId): Promise<string>;

  validate(userId: ObjectId, token: string): Promise<boolean>;

  get(userId: ObjectId): Promise<ForgotPasswordTokenModel | null>;

  delete(userId: ObjectId): Promise<void>;
}

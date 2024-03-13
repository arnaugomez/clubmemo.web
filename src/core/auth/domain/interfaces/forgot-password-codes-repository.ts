import { ObjectId } from "mongodb";
import { ForgotPasswordCodeModel } from "../models/forgot-password-code-model";

export interface ForgotPasswordCodesRepository {
  generate(userId: ObjectId): Promise<ForgotPasswordCodeModel>;
  get(userId: ObjectId): Promise<ForgotPasswordCodeModel | null>;
  delete(userId: ObjectId): Promise<void>;
}

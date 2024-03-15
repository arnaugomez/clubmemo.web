import { ForgotPasswordTokenModel } from "../models/forgot-password-token-model";

export interface ForgotPasswordTokensRepository {
  generate(userId: string): Promise<string>;

  validate(userId: string, token: string): Promise<boolean>;

  get(userId: string): Promise<ForgotPasswordTokenModel | null>;

  delete(userId: string): Promise<void>;
}

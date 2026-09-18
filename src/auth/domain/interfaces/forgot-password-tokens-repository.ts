import * as Context from "effect/Context";
import type * as Effect from "effect/Effect";
import type { ExternalServiceError } from "@/src/common/effect/errors";
import type { ForgotPasswordTokenModel } from "../models/forgot-password-token-model";

/**
 * Repository for 'forgot password' tokens. These tokens are used to reset the password
 * when the user forgets it.
 */
export interface ForgotPasswordTokensRepository {
  /**
   * Create a new 'forgot password' token for a user
   *
   * @param userId Id of the user
   */
  generate(userId: string): Effect.Effect<string, ExternalServiceError>;

  /**
   * Checks if the token exists and is valid for the user
   *
   * @param userId The id of the user
   * @param token The 'forgot password' token to validate
   * @returns `true` if the token is valid, `false` otherwise
   */
  validate(
    userId: string,
    token: string,
  ): Effect.Effect<boolean, ExternalServiceError>;

  /**
   * Gets the data of the forgot password token for a user. This data does not
   * contain the token itself (for security reasons, it should not be stored).
   * It contains only the expiration date.
   *
   * @param userId The data of the forgot password token
   */
  get(
    userId: string,
  ): Effect.Effect<ForgotPasswordTokenModel | null, ExternalServiceError>;

  /**
   * Deletes the forgot password tokens of a user
   *
   * @param userId The id of the user
   */
  delete(userId: string): Effect.Effect<void, ExternalServiceError>;
}

export const ForgotPasswordTokensRepository =
  Context.Service<ForgotPasswordTokensRepository>(
    "clubmemo/auth/domain/interfaces/forgot-password-tokens-repository/ForgotPasswordTokensRepository",
  );

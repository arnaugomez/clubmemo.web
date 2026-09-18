import * as Schema from "effect/Schema";

import { isWithinExpirationDate } from "oslo";

export const ForgotPasswordTokenModelDataSchema = Schema.Struct({
  userId: Schema.mutableKey(Schema.String),
  expiresAt: Schema.mutableKey(Schema.Date),
});
export type ForgotPasswordTokenModelData =
  typeof ForgotPasswordTokenModelDataSchema.Type;

/**
 * A token that is sent to the user's email to reset their password, when the
 * password is forgotten
 */
export class ForgotPasswordTokenModel extends Schema.Class<ForgotPasswordTokenModel>(
  "ForgotPasswordTokenModel",
)({ data: ForgotPasswordTokenModelDataSchema }) {
  constructor(data: ForgotPasswordTokenModelData) {
    super({ data });
  }

  get userId() {
    return this.data.userId;
  }

  /**
   * Is `true` if the verification code has reached its expiration date
   */
  get hasExpired() {
    return !isWithinExpirationDate(this.data.expiresAt);
  }
}

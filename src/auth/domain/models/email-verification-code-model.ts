import * as Schema from "effect/Schema";

import { isWithinExpirationDate } from "oslo";

export const EmailVerificationCodeModelDataSchema = Schema.Struct({
  userId: Schema.mutableKey(Schema.String),
  code: Schema.mutableKey(Schema.String),
  expiresAt: Schema.mutableKey(Schema.Date),
});
export type EmailVerificationCodeModelData =
  typeof EmailVerificationCodeModelDataSchema.Type;

/**
 * A token that is sent to the user's email to verify their email address
 */
export class EmailVerificationCodeModel extends Schema.Class<EmailVerificationCodeModel>(
  "EmailVerificationCodeModel",
)({ data: EmailVerificationCodeModelDataSchema }) {
  constructor(data: EmailVerificationCodeModelData) {
    super({ data });
  }

  get userId() {
    return this.data.userId;
  }

  /**
   * The code that the user must enter to verify their email address
   */
  get code() {
    return this.data.code;
  }

  /**
   * Is `true` if the verification code has reached its expiration date
   */
  get hasExpired() {
    return !isWithinExpirationDate(this.data.expiresAt);
  }
}

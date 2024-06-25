import { isWithinExpirationDate } from "oslo";

interface EmailVerificationCodeModelData {
  userId: string;
  code: string;
  expiresAt: Date;
}

/**
 * A token that is sent to the user's email to verify their email address
 */
export class EmailVerificationCodeModel {
  constructor(private data: EmailVerificationCodeModelData) {}

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

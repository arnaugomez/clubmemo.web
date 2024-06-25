import { isWithinExpirationDate } from "oslo";

interface ForgotPasswordTokenModelData {
  userId: string;
  expiresAt: Date;
}

/**
 * A token that is sent to the user's email to reset their password, when the
 * password is forgotten
 */
export class ForgotPasswordTokenModel {
  constructor(private data: ForgotPasswordTokenModelData) {}

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

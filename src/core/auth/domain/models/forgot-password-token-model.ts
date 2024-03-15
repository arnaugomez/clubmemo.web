import { isWithinExpirationDate } from "oslo";

interface ForgotPasswordTokenModelData {
  userId: string;
  expiresAt: Date;
}
export class ForgotPasswordTokenModel {
  constructor(private data: ForgotPasswordTokenModelData) {}

  get userId() {
    return this.data.userId;
  }

  get hasExpired() {
    return !isWithinExpirationDate(this.data.expiresAt);
  }
}

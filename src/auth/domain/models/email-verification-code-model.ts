import { isWithinExpirationDate } from "oslo";

interface EmailVerificationCodeModelData {
  userId: string;
  code: string;
  expiresAt: Date;
}

export class EmailVerificationCodeModel {
  constructor(private data: EmailVerificationCodeModelData) {}

  get userId() {
    return this.data.userId;
  }

  get code() {
    return this.data.code;
  }

  get hasExpired() {
    return !isWithinExpirationDate(this.data.expiresAt);
  }
}

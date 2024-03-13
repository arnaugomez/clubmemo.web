import { ObjectId } from "mongodb";
import { isWithinExpirationDate } from "oslo";

interface ForgotPasswordCodeModelData {
  userId: ObjectId;
  code: string;
  expiresAt: Date;
}
export class ForgotPasswordCodeModel {
  constructor(private data: ForgotPasswordCodeModelData) {}

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

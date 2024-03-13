import { waitMilliseconds } from "@/src/core/app/utils/promises";
import { ObjectId } from "mongodb";
import { TimeSpan, createDate } from "oslo";
import { alphabet, generateRandomString } from "oslo/crypto";
import { EmailVerificationCodesRepository } from "../../domain/interfaces/email-verification-codes-repository";
import { EmailVerificationCodeModel } from "../../domain/models/email-verification-code-model";
import { emailVerificationCodesCollection } from "../collections/email-verification-codes-collection";

export class EmailVerificationCodesRepositoryImpl
  implements EmailVerificationCodesRepository
{
  async generate(userId: ObjectId): Promise<EmailVerificationCodeModel> {
    await this.deleteByUserId(userId);

    const data = {
      userId,
      code: generateRandomString(6, alphabet("0-9")),
      expiresAt: createDate(new TimeSpan(10, "m")),
    };
    await emailVerificationCodesCollection.insertOne(data);

    return new EmailVerificationCodeModel(data);
  }

  async getByUserId(
    userId: ObjectId,
  ): Promise<EmailVerificationCodeModel | null> {
    const data = await emailVerificationCodesCollection.findOne({ userId });
    return data && new EmailVerificationCodeModel(data);
  }

  async verify(userId: ObjectId, code: string): Promise<boolean> {
    const verificationCode = await this.getByUserId(userId);
    if (!verificationCode || verificationCode.code !== code) {
      await waitMilliseconds(2000); // Prevent brute-force attacks
      return false;
    }
    await this.deleteByUserId(userId);

    if (verificationCode.hasExpired) {
      return false;
    }
    return true;
  }

  private async deleteByUserId(userId: ObjectId): Promise<void> {
    await emailVerificationCodesCollection.deleteMany({ userId });
  }
}

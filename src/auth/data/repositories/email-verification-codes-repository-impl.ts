import type { MongoService } from "@/src/common/domain/interfaces/mongo-service";
import { waitMilliseconds } from "@/src/common/domain/utils/promises";
import { ObjectId } from "mongodb";
import { TimeSpan, createDate } from "oslo";
import { alphabet, generateRandomString } from "oslo/crypto";
import type { EmailVerificationCodesRepository } from "../../domain/interfaces/email-verification-codes-repository";
import type { EmailVerificationCodeModel } from "../../domain/models/email-verification-code-model";
import {
  EmailVerificationCodeDocTransformer,
  emailVerificationCodesCollection,
} from "../collections/email-verification-codes-collection";

/**
 * Implementation of `EmailVerificationCodesRepository` with the MongoDB database
 */
export class EmailVerificationCodesRepositoryImpl
  implements EmailVerificationCodesRepository
{
  private readonly collection: typeof emailVerificationCodesCollection.type;
  constructor(mongoService: MongoService) {
    this.collection = mongoService.collection(emailVerificationCodesCollection);
  }

  async generate(userId: string): Promise<EmailVerificationCodeModel> {
    await this.deleteByUserId(userId);

    const doc = {
      userId: new ObjectId(userId),
      code: generateRandomString(6, alphabet("a-z", "0-9")),
      expiresAt: createDate(new TimeSpan(15, "m")),
    };
    await this.collection.insertOne(doc);

    return new EmailVerificationCodeDocTransformer(doc).toDomain();
  }

  async getByUserId(
    userId: string,
  ): Promise<EmailVerificationCodeModel | null> {
    const doc = await this.collection.findOne({ userId: new ObjectId(userId) });
    return doc && new EmailVerificationCodeDocTransformer(doc).toDomain();
  }

  async verify(userId: string, code: string): Promise<boolean> {
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

  private async deleteByUserId(userId: string): Promise<void> {
    await this.collection.deleteMany({ userId: new ObjectId(userId) });
  }
}

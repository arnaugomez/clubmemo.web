import { MongoService } from "@/src/core/app/domain/interfaces/mongo-service";
import { Collection, ObjectId } from "mongodb";
import { TimeSpan, createDate } from "oslo";
import { alphabet, generateRandomString, sha256 } from "oslo/crypto";
import { encodeHex } from "oslo/encoding";
import { ForgotPasswordTokensRepository } from "../../domain/interfaces/forgot-password-tokens-repository";
import { ForgotPasswordTokenModel } from "../../domain/models/forgot-password-token-model";
import {
  ForgotPasswordTokenDoc,
  forgotPasswordTokensCollection,
} from "../collections/forgot-password-tokens-collection";

export class ForgotPasswordTokensRepositoryImpl
  implements ForgotPasswordTokensRepository
{
  private readonly collection: Collection<ForgotPasswordTokenDoc>;
  constructor(mongoService: MongoService) {
    this.collection = mongoService.collection(forgotPasswordTokensCollection);
  }

  async generate(userId: ObjectId): Promise<string> {
    await this.collection.deleteMany({ userId });
    const token = generateRandomString(10, alphabet("A-Z", "0-9"));
    const doc = {
      userId,
      tokenHash: await this.hashToken(token),
      expiresAt: createDate(new TimeSpan(15, "m")),
    };
    await this.collection.insertOne(doc);
    return token;
  }

  async validate(userId: ObjectId, token: string): Promise<boolean> {
    const doc = await this.collection.findOne({ userId });
    if (!doc) return false;
    const tokenHash = await this.hashToken(token);
    return tokenHash === doc.tokenHash;
  }

  async get(userId: ObjectId): Promise<ForgotPasswordTokenModel | null> {
    const doc = await this.collection.findOne({ userId });
    return doc && new ForgotPasswordTokenModel(doc);
  }

  async delete(userId: ObjectId): Promise<void> {
    await this.collection.deleteOne({ userId });
  }

  async hashToken(token: string) {
    return encodeHex(await sha256(new TextEncoder().encode(token)));
  }
}

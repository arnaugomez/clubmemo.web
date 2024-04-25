import { MongoService } from "@/src/common/domain/interfaces/mongo-service";
import { Collection, ObjectId } from "mongodb";
import { TimeSpan, createDate } from "oslo";
import { alphabet, generateRandomString, sha256 } from "oslo/crypto";
import { encodeHex } from "oslo/encoding";
import { ForgotPasswordTokensRepository } from "../../domain/interfaces/forgot-password-tokens-repository";
import { ForgotPasswordTokenModel } from "../../domain/models/forgot-password-token-model";
import {
  ForgotPasswordTokenDoc,
  ForgotPasswordTokenDocTransformer,
  forgotPasswordTokensCollection,
} from "../collections/forgot-password-tokens-collection";

export class ForgotPasswordTokensRepositoryImpl
  implements ForgotPasswordTokensRepository
{
  private readonly collection: Collection<ForgotPasswordTokenDoc>;
  constructor(mongoService: MongoService) {
    this.collection = mongoService.collection(forgotPasswordTokensCollection);
  }

  async generate(userId: string): Promise<string> {
    await this.collection.deleteMany({ userId: new ObjectId(userId) });
    const token = generateRandomString(24, alphabet("a-z", "0-9"));
    const doc = {
      userId: new ObjectId(userId),
      tokenHash: await this.hashToken(token),
      expiresAt: createDate(new TimeSpan(1, "h")),
    };
    await this.collection.insertOne(doc);
    return token;
  }

  async validate(userId: string, token: string): Promise<boolean> {
    const doc = await this.collection.findOne({ userId: new ObjectId(userId) });
    if (!doc) return false;
    const tokenHash = await this.hashToken(token);
    return tokenHash === doc.tokenHash;
  }

  async get(userId: string): Promise<ForgotPasswordTokenModel | null> {
    const doc = await this.collection.findOne({ userId: new ObjectId(userId) });
    return doc && new ForgotPasswordTokenDocTransformer(doc).toDomain();
  }

  async delete(userId: string): Promise<void> {
    await this.collection.deleteOne({ userId: new ObjectId(userId) });
  }

  async hashToken(token: string) {
    return encodeHex(await sha256(new TextEncoder().encode(token)));
  }
}

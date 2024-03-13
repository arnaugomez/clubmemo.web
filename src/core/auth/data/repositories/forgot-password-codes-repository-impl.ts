import { MongoService } from "@/src/core/app/domain/interfaces/mongo-service";
import { Collection, ObjectId } from "mongodb";
import { TimeSpan, createDate } from "oslo";
import { alphabet, generateRandomString } from "oslo/crypto";
import { ForgotPasswordCodesRepository } from "../../domain/interfaces/forgot-password-codes-repository";
import { ForgotPasswordCodeModel } from "../../domain/models/forgot-password-code-model";
import {
  ForgotPasswordCodeDoc,
  forgotPasswordCodesCollection,
} from "../collections/forgot-password-codes-collection";

export class ForgotPasswordCodesRepositoryImpl
  implements ForgotPasswordCodesRepository
{
  private readonly collection: Collection<ForgotPasswordCodeDoc>;
  constructor(mongoService: MongoService) {
    this.collection = mongoService.collection(forgotPasswordCodesCollection);
  }

  async generate(userId: ObjectId): Promise<ForgotPasswordCodeModel> {
    await this.collection.deleteMany({ userId });
    const doc = {
      userId,
      code: generateRandomString(10, alphabet("A-Z", "0-9")),
      expiresAt: createDate(new TimeSpan(15, "m")),
    };
    await this.collection.insertOne(doc);
    return new ForgotPasswordCodeModel(doc);
  }

  async get(userId: ObjectId): Promise<ForgotPasswordCodeModel | null> {
    const doc = await this.collection.findOne({ userId });
    return doc && new ForgotPasswordCodeModel(doc);
  }

  async delete(userId: ObjectId): Promise<void> {
    await this.collection.deleteOne({ userId });
  }
}

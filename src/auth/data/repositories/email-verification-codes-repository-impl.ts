import * as DateTime from "effect/DateTime";
import * as Effect from "effect/Effect";
import { ObjectId } from "mongodb";
import { alphabet, generateRandomString } from "oslo/crypto";
import type { DatabaseService } from "@/src/common/domain/interfaces/database-service";
import { ExternalServiceError } from "@/src/common/effect/errors";
import type { EmailVerificationCodesRepository } from "../../domain/interfaces/email-verification-codes-repository";
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
  constructor(databaseService: DatabaseService) {
    this.collection = databaseService.collection(
      emailVerificationCodesCollection,
    );
  }

  generate = Effect.fn("EmailVerificationCodesRepositoryImpl.generate")(
    function* (this: EmailVerificationCodesRepositoryImpl, userId: string) {
      yield* this.deleteByUserId(userId);

      const doc = {
        userId: new ObjectId(userId),
        code: generateRandomString(6, alphabet("a-z", "0-9")),
        expiresAt: DateTime.toDateUtc(
          DateTime.add(yield* DateTime.now, { minutes: 15 }),
        ),
      };
      yield* Effect.tryPromise({
        try: () => this.collection.insertOne(doc),
        catch: (cause) =>
          new ExternalServiceError({
            operation: "EmailVerificationCodesRepositoryImpl.generate",
            cause,
          }),
      });

      return new EmailVerificationCodeDocTransformer(doc).toDomain();
    },
  ).bind(this);

  getByUserId = Effect.fn("EmailVerificationCodesRepositoryImpl.getByUserId")(
    function* (this: EmailVerificationCodesRepositoryImpl, userId: string) {
      const doc = yield* Effect.tryPromise({
        try: () => this.collection.findOne({ userId: new ObjectId(userId) }),
        catch: (cause) =>
          new ExternalServiceError({
            operation: "EmailVerificationCodesRepositoryImpl.getByUserId",
            cause,
          }),
      });
      return doc && new EmailVerificationCodeDocTransformer(doc).toDomain();
    },
  ).bind(this);

  verify = Effect.fn("EmailVerificationCodesRepositoryImpl.verify")(function* (
    this: EmailVerificationCodesRepositoryImpl,
    userId: string,
    code: string,
  ) {
    const verificationCode = yield* this.getByUserId(userId);
    if (!verificationCode || verificationCode.code !== code) {
      yield* Effect.sleep(2000); // Prevent brute-force attacks
      return false;
    }
    yield* this.deleteByUserId(userId);

    if (
      verificationCode.data.expiresAt.getTime() <=
      DateTime.toEpochMillis(yield* DateTime.now)
    ) {
      return false;
    }
    return true;
  }).bind(this);

  private deleteByUserId = Effect.fn(
    "EmailVerificationCodesRepositoryImpl.deleteByUserId",
  )(function* (this: EmailVerificationCodesRepositoryImpl, userId: string) {
    yield* Effect.tryPromise({
      try: () => this.collection.deleteMany({ userId: new ObjectId(userId) }),
      catch: (cause) =>
        new ExternalServiceError({
          operation: "EmailVerificationCodesRepositoryImpl.deleteByUserId",
          cause,
        }),
    });
  }).bind(this);
}

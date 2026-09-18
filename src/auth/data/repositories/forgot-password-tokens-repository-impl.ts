import * as DateTime from "effect/DateTime";
import * as Effect from "effect/Effect";
import type { Collection } from "mongodb";
import { ObjectId } from "mongodb";
import { alphabet, generateRandomString, sha256 } from "oslo/crypto";
import { encodeHex } from "oslo/encoding";
import type { DatabaseService } from "@/src/common/domain/interfaces/database-service";
import { ExternalServiceError } from "@/src/common/effect/errors";
import type { ForgotPasswordTokensRepository } from "../../domain/interfaces/forgot-password-tokens-repository";
import type { ForgotPasswordTokenDoc } from "../collections/forgot-password-tokens-collection";
import {
  ForgotPasswordTokenDocTransformer,
  forgotPasswordTokensCollection,
} from "../collections/forgot-password-tokens-collection";

/**
 * Implementation of `ForgotPasswordTokensRepository` with the MongoDB database
 */
export class ForgotPasswordTokensRepositoryImpl
  implements ForgotPasswordTokensRepository
{
  private readonly collection: Collection<ForgotPasswordTokenDoc>;
  constructor(databaseService: DatabaseService) {
    this.collection = databaseService.collection(
      forgotPasswordTokensCollection,
    );
  }

  generate = Effect.fn("ForgotPasswordTokensRepositoryImpl.generate")(
    function* (this: ForgotPasswordTokensRepositoryImpl, userId: string) {
      yield* this.delete(userId);
      const token = generateRandomString(24, alphabet("a-z", "0-9"));
      const doc = {
        userId: new ObjectId(userId),
        tokenHash: yield* this.hashToken(token),
        expiresAt: DateTime.toDateUtc(
          DateTime.add(yield* DateTime.now, { hours: 1 }),
        ),
      };
      yield* Effect.tryPromise({
        try: () => this.collection.insertOne(doc),
        catch: (cause) =>
          new ExternalServiceError({
            operation: "ForgotPasswordTokensRepositoryImpl.generate",
            cause,
          }),
      });
      return token;
    },
  ).bind(this);

  validate = Effect.fn("ForgotPasswordTokensRepositoryImpl.validate")(
    function* (
      this: ForgotPasswordTokensRepositoryImpl,
      userId: string,
      token: string,
    ) {
      const doc = yield* Effect.tryPromise({
        try: () => this.collection.findOne({ userId: new ObjectId(userId) }),
        catch: (cause) =>
          new ExternalServiceError({
            operation: "ForgotPasswordTokensRepositoryImpl.validate",
            cause,
          }),
      });
      if (!doc) return false;
      const tokenHash = yield* this.hashToken(token);
      return tokenHash === doc.tokenHash;
    },
  ).bind(this);

  get = Effect.fn("ForgotPasswordTokensRepositoryImpl.get")(function* (
    this: ForgotPasswordTokensRepositoryImpl,
    userId: string,
  ) {
    const doc = yield* Effect.tryPromise({
      try: () => this.collection.findOne({ userId: new ObjectId(userId) }),
      catch: (cause) =>
        new ExternalServiceError({
          operation: "ForgotPasswordTokensRepositoryImpl.get",
          cause,
        }),
    });
    return doc && new ForgotPasswordTokenDocTransformer(doc).toDomain();
  }).bind(this);

  delete = Effect.fn("ForgotPasswordTokensRepositoryImpl.delete")(function* (
    this: ForgotPasswordTokensRepositoryImpl,
    userId: string,
  ) {
    yield* Effect.tryPromise({
      try: () => this.collection.deleteMany({ userId: new ObjectId(userId) }),
      catch: (cause) =>
        new ExternalServiceError({
          operation: "ForgotPasswordTokensRepositoryImpl.delete",
          cause,
        }),
    });
  }).bind(this);

  private hashToken = Effect.fn("ForgotPasswordTokensRepositoryImpl.hashToken")(
    function* (this: ForgotPasswordTokensRepositoryImpl, token: string) {
      return encodeHex(
        yield* Effect.tryPromise({
          try: () => sha256(new TextEncoder().encode(token)),
          catch: (cause) =>
            new ExternalServiceError({
              operation: "ForgotPasswordTokensRepositoryImpl.hashToken",
              cause,
            }),
        }),
      );
    },
  ).bind(this);
}

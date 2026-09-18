import * as Effect from "effect/Effect";
import { ObjectId } from "mongodb";
import type { DatabaseService } from "@/src/common/domain/interfaces/database-service";
import { ExternalServiceError } from "@/src/common/effect/errors";
import type { UsersRepository } from "../../domain/interfaces/users-repository";
import {
  UserDocTransformer,
  usersCollection,
} from "../collections/users-collection";

/**
 * Implementation of `UsersRepository` with the MongoDB database
 */
export class UsersRepositoryImpl implements UsersRepository {
  private readonly usersCollection: typeof usersCollection.type;

  constructor(databaseService: DatabaseService) {
    this.usersCollection = databaseService.collection(usersCollection);
  }

  getByEmail = Effect.fn("UsersRepositoryImpl.getByEmail")(function* (
    this: UsersRepositoryImpl,
    email: string,
  ) {
    const doc = yield* Effect.tryPromise({
      try: () => this.usersCollection.findOne({ email }),
      catch: (cause) =>
        new ExternalServiceError({
          operation: "UsersRepositoryImpl.getByEmail",
          cause,
        }),
    });
    return doc && new UserDocTransformer(doc).toDomain();
  }).bind(this);

  delete = Effect.fn("UsersRepositoryImpl.delete")(function* (
    this: UsersRepositoryImpl,
    id: string,
  ) {
    yield* Effect.tryPromise({
      try: () => this.usersCollection.deleteOne({ _id: new ObjectId(id) }),
      catch: (cause) =>
        new ExternalServiceError({
          operation: "UsersRepositoryImpl.delete",
          cause,
        }),
    });
  }).bind(this);
}

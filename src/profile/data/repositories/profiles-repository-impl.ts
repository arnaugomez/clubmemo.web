import * as Effect from "effect/Effect";
import { ObjectId } from "mongodb";
import type { DatabaseService } from "@/src/common/domain/interfaces/database-service";
import { ExternalServiceError } from "@/src/common/effect/errors";
import { HandleAlreadyExistsError } from "../../domain/errors/profile-errors";
import type { ProfilesRepository } from "../../domain/interfaces/profiles-repository";
import type { UpdateProfileInputModel } from "../../domain/models/update-profile-input-model";
import {
  ProfileDocTransformer,
  profilesCollection,
} from "../collections/profiles-collection";

/**
 * Implementation of `ProfilesRepository` using the MongoDB database.
 */
export class ProfilesRepositoryImpl implements ProfilesRepository {
  private readonly collection: typeof profilesCollection.type;

  constructor(databaseService: DatabaseService) {
    this.collection = databaseService.collection(profilesCollection);
  }

  create = Effect.fn("ProfilesRepositoryImpl.create")(function* (
    this: ProfilesRepositoryImpl,
    userId: string,
  ) {
    yield* Effect.tryPromise({
      try: () =>
        this.collection.insertOne({
          userId: new ObjectId(userId),
          isPublic: false,
        }),
      catch: (cause) =>
        new ExternalServiceError({
          operation: "ProfilesRepositoryImpl.create",
          cause,
        }),
    });
  }).bind(this);

  deleteByUserId = Effect.fn("ProfilesRepositoryImpl.deleteByUserId")(
    function* (this: ProfilesRepositoryImpl, userId: string) {
      yield* Effect.tryPromise({
        try: () => this.collection.deleteMany({ userId: new ObjectId(userId) }),
        catch: (cause) =>
          new ExternalServiceError({
            operation: "ProfilesRepositoryImpl.deleteByUserId",
            cause,
          }),
      });
    },
  ).bind(this);

  getByUserId = Effect.fn("ProfilesRepositoryImpl.getByUserId")(function* (
    this: ProfilesRepositoryImpl,
    userId: string,
  ) {
    const doc = yield* Effect.tryPromise({
      try: () => this.collection.findOne({ userId: new ObjectId(userId) }),
      catch: (cause) =>
        new ExternalServiceError({
          operation: "ProfilesRepositoryImpl.getByUserId",
          cause,
        }),
    });
    return doc && new ProfileDocTransformer(doc).toDomain();
  }).bind(this);

  get = Effect.fn("ProfilesRepositoryImpl.get")(function* (
    this: ProfilesRepositoryImpl,
    id: string,
  ) {
    const doc = yield* Effect.tryPromise({
      try: () => this.collection.findOne({ _id: new ObjectId(id) }),
      catch: (cause) =>
        new ExternalServiceError({
          operation: "ProfilesRepositoryImpl.get",
          cause,
        }),
    });
    return doc && new ProfileDocTransformer(doc).toDomain();
  }).bind(this);

  getByHandle = Effect.fn("ProfilesRepositoryImpl.getByHandle")(function* (
    this: ProfilesRepositoryImpl,
    handle: string,
  ) {
    const doc = yield* Effect.tryPromise({
      try: () => this.collection.findOne({ handle }),
      catch: (cause) =>
        new ExternalServiceError({
          operation: "ProfilesRepositoryImpl.getByHandle",
          cause,
        }),
    });
    return doc && new ProfileDocTransformer(doc).toDomain();
  }).bind(this);

  update = Effect.fn("ProfilesRepositoryImpl.update")(function* (
    this: ProfilesRepositoryImpl,
    { id, ...input }: UpdateProfileInputModel,
  ) {
    const _id = new ObjectId(id);
    const profileWithHandle = yield* Effect.tryPromise({
      try: () =>
        this.collection.findOne({
          $and: [{ handle: input.handle }, { _id: { $ne: _id } }],
        }),
      catch: (cause) =>
        new ExternalServiceError({
          operation: "ProfilesRepositoryImpl.update",
          cause,
        }),
    });

    if (profileWithHandle)
      return yield* Effect.fail(new HandleAlreadyExistsError());

    yield* Effect.tryPromise({
      try: () => this.collection.updateOne({ _id }, { $set: input }),
      catch: (cause) =>
        new ExternalServiceError({
          operation: "ProfilesRepositoryImpl.update",
          cause,
        }),
    });
  }).bind(this);
}

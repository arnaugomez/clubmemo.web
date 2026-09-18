import * as Effect from "effect/Effect";
import { MongoBulkWriteError } from "mongodb";
import type { DatabaseService } from "@/src/common/domain/interfaces/database-service";
import { ExternalServiceError } from "@/src/common/effect/errors";
import type { TagsRepository } from "../../domain/interfaces/tags-repository";
import { tagsCollection } from "../collections/tags-collection";

/**
 * Implementation of `TagsRepository` using the MongoDB database.
 */
export class TagsRepositoryImpl implements TagsRepository {
  private readonly tags: typeof tagsCollection.type;

  constructor(databaseService: DatabaseService) {
    this.tags = databaseService.collection(tagsCollection);
  }

  create = Effect.fn("TagsRepositoryImpl.create")(function* (
    this: TagsRepositoryImpl,
    tags: string[],
  ) {
    if (!tags.length) return;
    yield* Effect.gen(
      function* (this: TagsRepositoryImpl) {
        yield* Effect.tryPromise({
          try: () =>
            this.tags.insertMany(
              tags.map((name) => ({ name })),
              { ordered: false },
            ),
          catch: (cause) =>
            new ExternalServiceError({
              operation: "TagsRepositoryImpl.create",
              cause,
            }),
        });
      }.bind(this),
    ).pipe(
      Effect.catch((e) =>
        Effect.gen(
          function* (this: TagsRepositoryImpl) {
            // Ignore duplicate key errors
            if (
              e.cause instanceof MongoBulkWriteError &&
              e.cause.code === 11000
            ) {
              return;
            }
            return yield* Effect.fail(e);
          }.bind(this),
        ),
      ),
    );
  }).bind(this);

  getSuggestions = Effect.fn("TagsRepositoryImpl.getSuggestions")(function* (
    this: TagsRepositoryImpl,
    query?: string,
  ) {
    const cursor = this.tags.find(
      query ? { name: { $regex: `^${query}`, $options: "i" } } : {},
      {
        limit: 5,
        projection: { name: true, _id: false },
      },
    );
    const results = yield* Effect.tryPromise({
      try: () => cursor.toArray(),
      catch: (cause) =>
        new ExternalServiceError({
          operation: "TagsRepositoryImpl.getSuggestions",
          cause,
        }),
    });
    return results.map((tag) => tag.name);
  }).bind(this);
}

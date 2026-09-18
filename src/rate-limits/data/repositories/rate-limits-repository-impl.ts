import * as DateTime from "effect/DateTime";
import * as Effect from "effect/Effect";
import type { DatabaseService } from "@/src/common/domain/interfaces/database-service";
import { ExternalServiceError } from "@/src/common/effect/errors";
import { DailyRateLimitError } from "../../domain/errors/rate-limits-errors";
import type { RateLimitsRepository } from "../../domain/interfaces/rate-limits-repository";
import { rateLimitsCollection } from "../collections/rate-limits-collection";

/**
 * Implementation of `RateLimitsRepository` using the MongoDB database.
 */
export class RateLimitsRepositoryImpl implements RateLimitsRepository {
  private readonly rateLimits: typeof rateLimitsCollection.type;

  constructor(databaseService: DatabaseService) {
    this.rateLimits = databaseService.collection(rateLimitsCollection);
  }

  check = Effect.fn("RateLimitsRepositoryImpl.check")(function* (
    this: RateLimitsRepositoryImpl,
    name: string,
    limit = 100,
  ) {
    const now = yield* DateTime.nowAsDate;
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const doc = yield* Effect.tryPromise({
      try: () =>
        this.rateLimits.findOne({
          name,
          updatedAt: { $gte: oneDayAgo },
        }),
      catch: (cause) =>
        new ExternalServiceError({
          operation: "RateLimitsRepositoryImpl.check",
          cause,
        }),
    });
    if (doc && doc.count >= limit) {
      return yield* Effect.fail(new DailyRateLimitError(limit));
    }
  }).bind(this);

  increment = Effect.fn("RateLimitsRepositoryImpl.increment")(function* (
    this: RateLimitsRepositoryImpl,
    name: string,
  ) {
    const now = yield* DateTime.nowAsDate;
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const doc = yield* Effect.tryPromise({
      try: () => this.rateLimits.findOne({ name }),
      catch: (cause) =>
        new ExternalServiceError({
          operation: "RateLimitsRepositoryImpl.increment",
          cause,
        }),
    });
    let updatedAt = doc?.updatedAt ?? now;
    let count = doc?.count ?? 0;

    if (updatedAt < oneDayAgo) {
      updatedAt = now;
      count = 0;
    }
    count++;

    yield* Effect.tryPromise({
      try: () =>
        this.rateLimits.updateOne(
          { name },
          { $set: { name, count, updatedAt } },
          { upsert: true },
        ),
      catch: (cause) =>
        new ExternalServiceError({
          operation: "RateLimitsRepositoryImpl.increment",
          cause,
        }),
    });
  }).bind(this);
}

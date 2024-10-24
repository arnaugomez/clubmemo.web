import type { DatabaseService } from "@/src/common/domain/interfaces/database-service";
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

  async check(name: string, limit = 100): Promise<void> {
    const doc = await this.rateLimits.findOne({
      name,
      updatedAt: { $gte: this.getOneDayAgo() },
    });
    if (doc && doc.count >= limit) {
      throw new DailyRateLimitError(limit);
    }
  }

  async increment(name: string): Promise<void> {
    const doc = await this.rateLimits.findOne({ name });
    let updatedAt = doc?.updatedAt ?? new Date();
    let count = doc?.count ?? 0;

    if (updatedAt < this.getOneDayAgo()) {
      updatedAt = new Date();
      count = 0;
    }
    count++;

    await this.rateLimits.updateOne(
      { name },
      { $set: { name, count, updatedAt } },
      { upsert: true },
    );
  }

  private getOneDayAgo(): Date {
    return new Date(Date.now() - 24 * 60 * 60 * 1000);
  }
}

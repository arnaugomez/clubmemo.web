import type { MongoService } from "@/src/common/domain/interfaces/mongo-service";
import { DailyRateLimitError } from "../../domain/errors/rate-limits-errors";
import type { RateLimitsRepository } from "../../domain/interfaces/rate-limits-repository";
import { rateLimitsCollection } from "../collections/rate-limits-collection";

export class RateLimitsRepositoryImpl implements RateLimitsRepository {
  private readonly rateLimits: typeof rateLimitsCollection.type;

  constructor(mongoService: MongoService) {
    this.rateLimits = mongoService.collection(rateLimitsCollection);
    this.rateLimits.createIndex({ name: 1 });
    this.rateLimits.createIndex({ name: 1, updatedAt: 1 });
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

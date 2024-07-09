import type { DatabaseService } from "@/src/common/domain/interfaces/database-service";
import { MongoBulkWriteError } from "mongodb";
import type { TagsRepository } from "../../domain/interfaces/tags-repository";
import { tagsCollection } from "../collections/tags-collection";

/**
 * Implementation of `TagsRepository` using the MongoDB database.
 */
export class TagsRepositoryImpl implements TagsRepository {
  private readonly tags: typeof tagsCollection.type;

  constructor(databaseService: DatabaseService) {
    this.tags = databaseService.collection(tagsCollection);
    this.tags.createIndex({ name: 1 }, { unique: true });
  }
  async create(tags: string[]): Promise<void> {
    if (!tags.length) return;
    try {
      await this.tags.insertMany(
        tags.map((name) => ({ name })),
        { ordered: false },
      );
    } catch (e) {
      // Ignore duplicate key errors
      if (e instanceof MongoBulkWriteError && e.code === 11000) {
        return;
      }
      throw e;
    }
  }

  async getSuggestions(query?: string): Promise<string[]> {
    const cursor = this.tags.find(
      query ? { name: { $regex: `^${query}`, $options: "i" } } : {},
      {
        limit: 5,
        projection: { name: true, _id: false },
      },
    );
    const results = await cursor.toArray();
    return results.map((tag) => tag.name);
  }
}

import type { MongoService } from "@/src/common/domain/interfaces/mongo-service";
import { MongoBulkWriteError } from "mongodb";
import type { TagsRepository } from "../../domain/interfaces/tags-repository";
import { tagsCollection } from "../collections/tags-collection";

export class TagsRepositoryImpl implements TagsRepository {
  private readonly tags: typeof tagsCollection.type;

  constructor(mongoService: MongoService) {
    this.tags = mongoService.collection(tagsCollection);
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

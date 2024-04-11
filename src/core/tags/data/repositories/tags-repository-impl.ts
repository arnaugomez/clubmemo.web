import { MongoService } from "@/src/core/common/domain/interfaces/mongo-service";
import { TagsRepository } from "../../domain/interfaces/tags-repository";
import { tagsCollection } from "../collections/tags-collection";

export class TagsRepositoryImpl implements TagsRepository {
  private readonly tags: typeof tagsCollection.type;

  constructor(mongoService: MongoService) {
    this.tags = mongoService.collection(tagsCollection);
    this.tags.createIndex({ name: 1 }, { unique: true });
  }
  async create(tags: string[]): Promise<void> {
    try {
      await this.tags.insertMany(
        tags.map((name) => ({ name })),
        { ordered: false },
      );
    } catch (e) {
      // TODO: handle "element already exists" error
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

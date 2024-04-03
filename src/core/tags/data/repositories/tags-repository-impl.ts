import { MongoService } from "@/src/core/app/domain/interfaces/mongo-service";
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
      this.tags.insertMany(
        tags.map((name) => ({ name })),
        { ordered: false },
      );
    } catch (e) {
      console.log(e);
    }
  }
}

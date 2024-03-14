import { MongoService } from "@/src/core/app/domain/interfaces/mongo-service";
import { Collection, ObjectId } from "mongodb";
import { ProfilesRepository } from "../../domain/interfaces/profiles-repository";
import {
  ProfileDoc,
  profilesCollection,
} from "../collections/profiles-collection";

export class ProfilesRepositoryImpl implements ProfilesRepository {
  private readonly collection: Collection<ProfileDoc>;

  constructor(mongoService: MongoService) {
    this.collection = mongoService.collection(profilesCollection);
  }

  async create(userId: ObjectId): Promise<void> {
    await this.collection.insertOne({ userId });
  }

  async getByUserId(userId: ObjectId): Promise<ProfileDoc | null> {
    const doc = await this.collection.findOne({ userId });
    return doc;
  }
}

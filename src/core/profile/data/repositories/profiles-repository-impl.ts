import { MongoService } from "@/src/core/app/domain/interfaces/mongo-service";
import { Collection, ObjectId } from "mongodb";
import { ProfilesRepository } from "../../domain/interfaces/profiles-repository";
import { ProfileModel } from "../../domain/models/profile-model";
import {
  ProfileDoc,
  ProfileDocTransformer,
  profilesCollection,
} from "../collections/profiles-collection";

export class ProfilesRepositoryImpl implements ProfilesRepository {
  private readonly collection: Collection<ProfileDoc>;

  constructor(mongoService: MongoService) {
    this.collection = mongoService.collection(profilesCollection);
  }

  async create(userId: string): Promise<void> {
    await this.collection.insertOne({ userId: new ObjectId(userId) });
  }

  async getByUserId(userId: string): Promise<ProfileModel | null> {
    const doc = await this.collection.findOne({ userId: new ObjectId(userId) });
    return doc && new ProfileDocTransformer(doc).toDomain();
  }
}

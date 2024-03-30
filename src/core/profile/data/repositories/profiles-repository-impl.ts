import { MongoService } from "@/src/core/app/domain/interfaces/mongo-service";
import { ObjectId } from "mongodb";
import { HandleAlreadyExistsError } from "../../domain/errors/profile-errors";
import { ProfilesRepository } from "../../domain/interfaces/profiles-repository";
import { ProfileModel } from "../../domain/models/profile-model";
import { UpdateProfileInputModel } from "../../domain/models/update-profile-input-model";
import {
  ProfileDocTransformer,
  profilesCollection,
} from "../collections/profiles-collection";

export class ProfilesRepositoryImpl implements ProfilesRepository {
  private readonly collection: typeof profilesCollection.type;

  constructor(mongoService: MongoService) {
    this.collection = mongoService.collection(profilesCollection);
  }
  async create(userId: string): Promise<void> {
    await this.collection.insertOne({
      userId: new ObjectId(userId),
      isPublic: false,
    });
  }

  async deleteByUserId(userId: string): Promise<void> {
    await this.collection.deleteMany({ userId: new ObjectId(userId) });
  }

  async getByUserId(userId: string): Promise<ProfileModel | null> {
    const doc = await this.collection.findOne({ userId: new ObjectId(userId) });
    return doc && new ProfileDocTransformer(doc).toDomain();
  }

  async get(id: string): Promise<ProfileModel | null> {
    const doc = await this.collection.findOne({ _id: new ObjectId(id) });
    return doc && new ProfileDocTransformer(doc).toDomain();
  }

  async getByHandle(handle: string): Promise<ProfileModel | null> {
    const doc = await this.collection.findOne({ handle });
    return doc && new ProfileDocTransformer(doc).toDomain();
  }

  async update({ id, ...input }: UpdateProfileInputModel): Promise<void> {
    const _id = new ObjectId(id);
    const profileWithHandle = await this.collection.findOne({
      $and: [{ handle: input.handle }, { _id: { $ne: _id } }],
    });

    if (profileWithHandle) throw new HandleAlreadyExistsError();

    await this.collection.updateOne({ _id }, { $set: input });
  }
}

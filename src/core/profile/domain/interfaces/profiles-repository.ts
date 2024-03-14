import { ObjectId } from "mongodb";
import { ProfileDoc } from "../../data/collections/profiles-collection";

export interface ProfilesRepository {
  create(userId: ObjectId): Promise<void>;
  // TODO: return ProfileModel
  getByUserId(userId: ObjectId): Promise<ProfileDoc | null>;
}

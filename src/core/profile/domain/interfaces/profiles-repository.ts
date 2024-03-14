import { ObjectId } from "mongodb";
import { ProfileModel } from "../models/profile-model";

export interface ProfilesRepository {
  create(userId: ObjectId): Promise<void>;

  getByUserId(userId: ObjectId): Promise<ProfileModel | null>;
}

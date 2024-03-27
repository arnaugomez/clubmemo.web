import { ProfileModel } from "../models/profile-model";

export interface ProfilesRepository {
  create(userId: string): Promise<void>;

  getByUserId(userId: string): Promise<ProfileModel | null>;

  deleteByUserId(userId: string): Promise<void>;
}

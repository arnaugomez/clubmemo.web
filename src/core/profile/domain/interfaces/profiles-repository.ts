import { ProfileModel } from "../models/profile-model";
import { UpdateProfileInputModel } from "../models/update-profile-input-model";

export interface ProfilesRepository {
  create(userId: string): Promise<void>;

  getByUserId(userId: string): Promise<ProfileModel | null>;

  deleteByUserId(userId: string): Promise<void>;

  get(id: string): Promise<ProfileModel | null>;

  getByHandle(handle: string): Promise<ProfileModel | null>;

  update(input: UpdateProfileInputModel): Promise<void>;
}

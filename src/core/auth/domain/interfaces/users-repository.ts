import { ObjectId } from "mongodb";
import { UserModel } from "../models/user-model";

export interface UpdatePasswordModel {
  userId: ObjectId;
  password: string;
}

export interface UsersRepository {
  getByEmail(email: string): Promise<UserModel | null>;
  updatePassword(model: UpdatePasswordModel): Promise<void>;
}

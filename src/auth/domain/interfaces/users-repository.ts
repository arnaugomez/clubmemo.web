import { UserModel } from "../models/user-model";

export interface UsersRepository {
  getByEmail(email: string): Promise<UserModel | null>;

  delete(id: string): Promise<void>;
}

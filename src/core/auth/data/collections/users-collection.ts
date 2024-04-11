import { collection } from "@/src/core/common/utils/mongo";
import { RegisteredDatabaseUserAttributes, User } from "lucia";
import { WithId } from "mongodb";
import { UserModel } from "../../domain/models/user-model";

export interface UserDoc extends RegisteredDatabaseUserAttributes {}
export const usersCollection = collection<UserDoc>("users");

export class UserDocTransformer {
  constructor(private readonly user: WithId<UserDoc>) {}

  toDomain(): UserModel {
    return new UserModel({
      ...this.user,
      id: this.user._id.toString(),
    });
  }
}

export class LuciaUserTransformer {
  constructor(private readonly user: User) {}

  toDomain(): UserModel {
    return new UserModel({
      ...this.user,
      id: this.user.id.toString(),
    });
  }
}

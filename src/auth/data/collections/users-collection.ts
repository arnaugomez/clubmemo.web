import { collection } from "@/src/common/data/utils/mongo";
import type { RegisteredDatabaseUserAttributes, User } from "lucia";
import type { WithId } from "mongodb";
import { UserModel } from "../../domain/models/user-model";

/**
 * MongoDB document representing the fields of a registered user.
 * It inherits the fields from the Lucia authentication library.
 */
export interface UserDoc extends RegisteredDatabaseUserAttributes {}

/**
 * Collection of MongoDB documents of type `UserDoc`
 */
export const usersCollection = collection<UserDoc>("users");

/**
 * Transforms a `UserDoc` instance with the user data from the database into a
 * `UserModel` instance of the domain layer.
 */
export class UserDocTransformer {
  constructor(private readonly user: WithId<UserDoc>) {}

  /**
   * Transforms a `UserDoc` instance with the user data from the database into a
   * `UserModel` instance of the domain layer.
   * @returns the `UserModel` instance.
   */
  toDomain(): UserModel {
    return new UserModel({
      ...this.user,
      id: this.user._id.toString(),
    });
  }
}

/**
 * Transforms a `User` instance of the Lucia authentication library into a
 * `UserModel` instance of the domain layer.
 */
export class LuciaUserTransformer {
  constructor(private readonly user: User) {}

  /**
   * Transforms a `User` instance of the Lucia authentication library into a
   * `UserModel` instance of the domain layer.
   * @returns The `UserModel` instance that belongs to the domain layer
   */
  toDomain(): UserModel {
    return new UserModel({
      ...this.user,
      id: this.user.id.toString(),
    });
  }
}

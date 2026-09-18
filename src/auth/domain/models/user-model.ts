import * as Schema from "effect/Schema";

import { AuthTypeModel } from "./auth-type-model";

export const UserModelDataSchema = Schema.Struct({
  id: Schema.mutableKey(Schema.String),
  email: Schema.mutableKey(Schema.String),
  authTypes: Schema.mutableKey(
    Schema.mutable(Schema.Array(Schema.Enum(AuthTypeModel))),
  ),
  isEmailVerified: Schema.mutableKey(Schema.optional(Schema.Boolean)),
  isAdmin: Schema.mutableKey(Schema.optional(Schema.Boolean)),
});
export type UserModelData = typeof UserModelDataSchema.Type;

/**
 * A user of the application. The user represents a person that is using the
 * application, and has a set of credentials to log in and access its services.
 *
 * Each user has an email. The email is unique: no two users can have the same.
 */
export class UserModel extends Schema.Class<UserModel>("UserModel")({
  data: UserModelDataSchema,
}) {
  constructor(data: UserModelData) {
    super({ data });
  }

  get id() {
    return this.data.id;
  }

  get email() {
    return this.data.email;
  }

  /**
   * Types of authentication methods that can be used to log in
   * with this user
   */
  get authTypes() {
    return this.data.authTypes;
  }

  /**
   * Whether the user has verified their email address
   */
  get isEmailVerified() {
    return this.data.isEmailVerified ?? false;
  }

  /**
   * Whether the user can access the admin panel
   */
  get isAdmin() {
    return this.data.isAdmin ?? false;
  }
}

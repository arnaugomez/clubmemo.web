import type { AuthTypeModel } from "./auth-type-model";

interface UserModelData {
  id: string;
  email: string;
  authTypes: AuthTypeModel[];
  isEmailVerified?: boolean;
}

/**
 * A user of the application. The user represents a person that is using the
 * application, and has a set of credentials to log in and access its services.
 *
 * Each user has an email. The email is unique: no two users can have the same.
 */
export class UserModel {
  constructor(private data: UserModelData) {}

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
    return this.data.isEmailVerified;
  }
}

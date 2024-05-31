import type { UserModel } from "../models/user-model";

/**
 * Repository for users.
 *
 * Users identify the people that are using the app. They contain the
 * credentials to log in. Currently, only email + password is supported, but the
 * model can be extended to support other methods like social login.
 *
 * Users do not contain the data that the user makes public to other
 * participants of the platform. That data is stored in the profile(s) of the
 * user.
 *
 *
 * A user is identified by its email. There cannot be two users with the same
 * email.
 */
export interface UsersRepository {
  /**
   * Gets the user that has a certain email.
   *
   * A user is identified by its email. There cannot be two users with the same
   * email.
   *
   * @param email The email of the user
   * @returns The user with the email if it exists, `null` otherwise
   */
  getByEmail(email: string): Promise<UserModel | null>;

  /**
   * Deletes a user permanently. Does not delete the user's profile(s) and other
   * data (this must be done by calling the methods of other services).
   *
   * @param id The id of the user
   */
  delete(id: string): Promise<void>;
}

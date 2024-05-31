import type { ProfileModel } from "../models/profile-model";
import type { UpdateProfileInputModel } from "../models/update-profile-input-model";

/**
 * Repository for profiles.
 *
 * A profile contains the public information of a user. It is used to display
 * its data to other users, such as the user's name, bio, profile picture, etc.
 *
 * The profile is always used on behalf of the user to interact with courses,
 * cards and other profiles. For example, when a user enrolls a course, the
 * profile is linked to the course enrollment, not the user itself.
 *
 * The reason to have the profile and the user as separate entities is to have
 * the sufficient flexibility to allow the user to have multiple profiles in
 * future versions of the program.
 */
export interface ProfilesRepository {
  /**
   * Creates a new empty profile
   *
   * @param userId The user the new profile belongs to
   */
  create(userId: string): Promise<void>;

  /**
   * Gets the current profile of the user.
   *
   * If the user does not exist or does not have a profile, it returns `null`.
   *
   * @param userId The id of the user
   * @returns The current profile of the user if it exists, `null` otherwise
   */
  getByUserId(userId: string): Promise<ProfileModel | null>;

  /**
   * Deletes all the profiles of a user.
   *
   * @param userId The user id of the profiles
   */
  deleteByUserId(userId: string): Promise<void>;

  /**
   * Gets a profile by its id.
   *
   * @param id The id of the profile
   * @returns The profile if it exists, `null` otherwise
   */
  get(id: string): Promise<ProfileModel | null>;

  /**
   * Gets a profile by its handle. The handle is a unique identifier of the
   * profile, like on social networks like Twitter.
   *
   * @param handle The unique identifier of the profile, like on Twitter
   * @returns The profile if it exists, `null` otherwise
   */
  getByHandle(handle: string): Promise<ProfileModel | null>;

  /**
   * Modifies the data of the profile
   *
   * @param input The new data of the profile that needs to be changes
   */
  update(input: UpdateProfileInputModel): Promise<void>;
}

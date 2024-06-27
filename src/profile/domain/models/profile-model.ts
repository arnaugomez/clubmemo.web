export interface ProfileModelData {
  id: string;
  userId: string;
  displayName?: string;
  handle?: string;
  bio?: string;
  picture?: string;
  backgroundPicture?: string;
  website?: string;
  isPublic: boolean;
  tags?: string[];
}

/**
 * A profile of a user
 *
 * A profile can be public or private and contains the data that the user wants
 * to share with others on the platform, or use to customize their experience.
 *
 * When the user interacts with the platform, they never do it directly through
 * the `UserModel` entity. They always do it through the `ProfileModel`. For
 * example, when a user enrolls in a course, the user does it through the
 * `ProfileModel` of the profile that is currently active.
 *
 * In the current version of the platform, the user can only have one profile.
 * Hovever, the profile domain model has been designed to allow for extension in
 * its capabilities, so that in future versions the user might be able to have
 * multiple profiles.
 */
export class ProfileModel {
  constructor(readonly data: ProfileModelData) {}

  get id() {
    return this.data.id;
  }
  get userId() {
    return this.data.userId;
  }
  /**
   * Name of the profile that is publicly visible (provided that
   * the profile is public too).
   */
  get displayName() {
    return this.data.displayName;
  }
  /**
   * Unique identifier of the profile that is publicly visible. It is
   * commonly used on social networks. It can only contain letters,
   * numbers and the underscore character (`_`).
   */
  get handle() {
    return this.data.handle;
  }
  /**
   * Short description of the profile that appears after the `displayName`
   */
  get bio() {
    return this.data.bio;
  }
  get picture() {
    return this.data.picture;
  }
  get backgroundPicture() {
    return this.data.backgroundPicture;
  }
  get website() {
    return this.data.website;
  }
  /**
   * Whether the profile can be seen by other users or not.
   * If the profile is private, the value is `false`.
   */
  get isPublic() {
    return this.data.isPublic;
  }
  /**
   * List of interests of the profile
   */
  get tags() {
    return this.data.tags ?? [];
  }
}

import * as Schema from "effect/Schema";

export const ProfileModelDataSchema = Schema.Struct({
  id: Schema.mutableKey(Schema.String),
  userId: Schema.mutableKey(Schema.String),
  displayName: Schema.mutableKey(Schema.optional(Schema.NullOr(Schema.String))),
  handle: Schema.mutableKey(Schema.optional(Schema.NullOr(Schema.String))),
  bio: Schema.mutableKey(Schema.optional(Schema.NullOr(Schema.String))),
  picture: Schema.mutableKey(Schema.optional(Schema.NullOr(Schema.String))),
  backgroundPicture: Schema.mutableKey(
    Schema.optional(Schema.NullOr(Schema.String)),
  ),
  website: Schema.mutableKey(Schema.optional(Schema.NullOr(Schema.String))),
  isPublic: Schema.mutableKey(Schema.Boolean),
  tags: Schema.mutableKey(
    Schema.optional(Schema.NullOr(Schema.mutable(Schema.Array(Schema.String)))),
  ),
});
export type ProfileModelData = typeof ProfileModelDataSchema.Type;

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
export class ProfileModel extends Schema.Class<ProfileModel>("ProfileModel")({
  data: ProfileModelDataSchema,
}) {
  constructor(data: ProfileModelData) {
    super({ data });
  }

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
    return this.data.displayName ?? undefined;
  }
  /**
   * Unique identifier of the profile that is publicly visible. It is
   * commonly used on social networks. It can only contain letters,
   * numbers and the underscore character (`_`).
   */
  get handle() {
    return this.data.handle ?? undefined;
  }
  /**
   * Short description of the profile that appears after the `displayName`
   */
  get bio() {
    return this.data.bio ?? undefined;
  }
  get picture() {
    return this.data.picture ?? undefined;
  }
  get backgroundPicture() {
    return this.data.backgroundPicture ?? undefined;
  }
  get website() {
    return this.data.website ?? undefined;
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

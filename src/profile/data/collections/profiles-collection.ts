import { collection } from "@/src/common/data/utils/mongo";
import type { ObjectId, WithId } from "mongodb";
import { ProfileModel } from "../../domain/models/profile-model";

/**
 * The data of a profile as it is stored in the database
 */
export interface ProfileDoc {
  userId: ObjectId;
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
 * Collection of MongoDB documents of type `ProfileDoc`
 */
export const profilesCollection = collection<ProfileDoc>("profiles");

/**
 * Converts the profile data of the database document into a `ProfileModel`
 * object of the domain layer
 */
export class ProfileDocTransformer {
  constructor(private readonly doc: WithId<ProfileDoc>) {}

  /**
   * Converts the profile data into a `ProfileModel` object of the
   * domain layer
   */
  toDomain(): ProfileModel {
    return new ProfileModel({
      id: this.doc._id.toString(),
      userId: this.doc.userId.toString(),
      displayName: this.doc.displayName,
      handle: this.doc.handle,
      bio: this.doc.bio,
      picture: this.doc.picture,
      backgroundPicture: this.doc.backgroundPicture,
      website: this.doc.website,
      isPublic: this.doc.isPublic,
      tags: this.doc.tags,
    });
  }
}

import { collection } from "@/src/common/data/utils/mongo";
import type { ObjectId, WithId } from "mongodb";
import { ProfileModel } from "../../domain/models/profile-model";

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

export const profilesCollection = collection<ProfileDoc>("profiles");

export class ProfileDocTransformer {
  constructor(private readonly doc: WithId<ProfileDoc>) {}

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

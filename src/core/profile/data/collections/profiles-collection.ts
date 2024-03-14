import { collection } from "@/src/core/app/utils/mongo";
import { ObjectId, WithId } from "mongodb";
import { ProfileModel } from "../../domain/models/profile-model";

export interface ProfileDoc {
  userId: ObjectId;
  displayName?: string;
  handle?: string;
  bio?: string;
  picture?: string;
  backgroundPicture?: string;
}

export const profilesCollection = collection<ProfileDoc>("profiles");

export class ProfileDocTransformer {
  constructor(private readonly doc: WithId<ProfileDoc>) {}

  toDomain(): ProfileModel {
    return new ProfileModel({
      id: this.doc._id,
      userId: this.doc.userId,
      displayName: this.doc.displayName,
      handle: this.doc.handle,
      bio: this.doc.bio,
      picture: this.doc.picture,
      backgroundPicture: this.doc.backgroundPicture,
    });
  }
}

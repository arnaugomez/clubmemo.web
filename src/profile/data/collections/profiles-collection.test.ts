import type { ProfileDoc } from "@/src/profile/data/collections/profiles-collection";
import { ProfileDocTransformer } from "@/src/profile/data/collections/profiles-collection";
import { ProfileModel } from "@/src/profile/domain/models/profile-model";
import type { WithId } from "mongodb";
import { ObjectId } from "mongodb";
import { describe, expect, it } from "vitest";

describe("ProfileDocTransformer", () => {
  it("transforms ProfileDoc to ProfileModel", () => {
    const mockProfileDoc: WithId<ProfileDoc> = {
      _id: new ObjectId(),
      userId: new ObjectId(),
      displayName: "Test Profile Name",
      handle: "test_user_114",
      bio: "Test bio of the profile",
      picture: "https://example.com/picture.jpg",
      backgroundPicture: "https://example.com/background.jpg",
      website: "https://johndoe.com",
      isPublic: true,
      tags: ["maths", "science", "history", "programming"],
    };

    const transformer = new ProfileDocTransformer(mockProfileDoc);
    const profileModel = transformer.toDomain();

    expect(profileModel).toBeInstanceOf(ProfileModel);
    expect(profileModel.id).toBe(mockProfileDoc._id.toString());
    expect(profileModel.userId).toBe(mockProfileDoc.userId.toString());
    expect(profileModel.displayName).toBe(mockProfileDoc.displayName);
    expect(profileModel.handle).toBe(mockProfileDoc.handle);
    expect(profileModel.bio).toBe(mockProfileDoc.bio);
    expect(profileModel.picture).toBe(mockProfileDoc.picture);
    expect(profileModel.backgroundPicture).toBe(
      mockProfileDoc.backgroundPicture,
    );
    expect(profileModel.website).toBe(mockProfileDoc.website);
    expect(profileModel.isPublic).toBe(mockProfileDoc.isPublic);
    expect(profileModel.tags).toEqual(mockProfileDoc.tags);
  });
});

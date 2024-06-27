import { describe, expect, it } from "vitest";
import type { ProfileModelData } from "./profile-model";
import { ProfileModel } from "./profile-model";

describe("ProfileModel", () => {
  const mockProfileData: ProfileModelData = {
    id: "1",
    userId: "añlsjfñakj",
    displayName: "Test User 1",
    handle: "test_user_1",
    bio: "Bio of the test user 1",
    picture: "https://example.com/picture.jpg",
    backgroundPicture: "https://example.com/picture.jpg",
    website: "https://example.com",
    isPublic: true,
    tags: ["tag1", "tag2", "tag3"],
  };

  const profile = new ProfileModel(mockProfileData);

  it("id matches data", () => {
    expect(profile.id).toBe(mockProfileData.id);
  });

  it("userId matches data", () => {
    expect(profile.userId).toBe(mockProfileData.userId);
  });

  it("displayName matches data", () => {
    expect(profile.displayName).toBe(mockProfileData.displayName);
  });

  it("handle matches data", () => {
    expect(profile.handle).toBe(mockProfileData.handle);
  });

  it("bio matches data", () => {
    expect(profile.bio).toBe(mockProfileData.bio);
  });

  it("picture matches data", () => {
    expect(profile.picture).toBe(mockProfileData.picture);
  });

  it("backgroundPicture matches data", () => {
    expect(profile.backgroundPicture).toBe(mockProfileData.backgroundPicture);
  });

  it("website matches data", () => {
    expect(profile.website).toBe(mockProfileData.website);
  });

  it("isPublic matches data", () => {
    expect(profile.isPublic).toBe(mockProfileData.isPublic);
  });

  it("tags matches data", () => {
    expect(profile.tags).toEqual(mockProfileData.tags);
  });

  it("tags is [] if data.tags is undefined", () => {
    const newData = { ...mockProfileData, tags: undefined };
    const newProfile = new ProfileModel(newData);
    expect(newProfile.tags).toStrictEqual([]);
  });

  it("handle matches data if data.handle is undefined", () => {
    const newData = { ...mockProfileData, handle: undefined };
    const newProfile = new ProfileModel(newData);
    expect(newProfile.handle).toBeUndefined();
  });
});

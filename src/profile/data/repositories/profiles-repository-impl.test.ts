import { DatabaseServiceImpl } from "@/src/common/data/services/database-service-impl";
import { locator } from "@/src/common/di/locator";
import { ObjectId } from "mongodb";
import { beforeEach, describe, expect, it } from "vitest";
import { profilesCollection } from "../collections/profiles-collection";

describe("ProfilesRepositoryImpl", () => {
  beforeEach(async () => {
    locator.DatabaseService = () =>
      new DatabaseServiceImpl(locator.EnvService(), "ProfilesRepositoryImpl");
    const databaseService = locator.DatabaseService();
    await databaseService.collection(profilesCollection).deleteMany();
  });

  it("create creates a new private profile", async () => {
    const userObjectId = new ObjectId();
    const userId = userObjectId.toString();
    const repository = await locator.ProfilesRepository();
    await repository.create(userId);
    const databaseService = locator.DatabaseService();
    const [profilesCount, profile] = await Promise.all([
      databaseService.collection(profilesCollection).countDocuments(),
      databaseService
        .collection(profilesCollection)
        .findOne({ userId: new ObjectId(userId) }),
    ]);

    expect(profilesCount).toBe(1);
    expect(profile).not.toBeNull();
    expect(profile?.userId).toEqual(userObjectId);
    expect(profile?.isPublic).toBe(false);
  });
});

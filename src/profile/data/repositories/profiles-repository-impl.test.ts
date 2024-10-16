import { DatabaseServiceImpl } from "@/src/common/data/services/database-service-impl";
import { singleton } from "@/src/common/di/locator-utils";
import { locator_common_DatabaseService } from "@/src/common/locators/locator_database-service";
import { locator_common_EnvService } from "@/src/common/locators/locator_env-service";
import { ObjectId } from "mongodb";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { locator_profiles_ProfilesRepository } from "../../locators/locator_profiles-repository";
import { profilesCollection } from "../collections/profiles-collection";

vi.mock("@/src/common/locators/locator_database-service", () => ({
  locator_common_DatabaseService: singleton(
    () =>
      new DatabaseServiceImpl(
        locator_common_EnvService(),
        "ProfilesRepositoryImpl",
      ),
  ),
}));

describe("ProfilesRepositoryImpl", () => {
  beforeEach(async () => {
    const databaseService = locator_common_DatabaseService();
    await databaseService.collection(profilesCollection).deleteMany();
  });

  it("create creates a new private profile", async () => {
    const userObjectId = new ObjectId();
    const userId = userObjectId.toString();
    const repository = locator_profiles_ProfilesRepository();
    await repository.create(userId);
    const databaseService = locator_common_DatabaseService();
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

import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import * as ManagedRuntime from "effect/ManagedRuntime";
import { afterAll } from "vitest";
import { DatabaseService } from "@/src/common/domain/interfaces/database-service";
import { testDatabaseLayer } from "@/test/utils/database";
import {
  ProfilesRepository,
  ProfilesRepositoryLive,
} from "../../layers/layer_profiles-repository";

const runtime = ManagedRuntime.make(
  ProfilesRepositoryLive.pipe(Layer.provideMerge(testDatabaseLayer)),
);
afterAll(() => runtime.dispose());

import { ObjectId } from "mongodb";
import { beforeEach, describe, expect, it } from "vitest";
import { profilesCollection } from "../collections/profiles-collection";

describe("ProfilesRepositoryImpl", () => {
  beforeEach(async () => {
    const databaseService = await runtime.runPromise(DatabaseService);
    await databaseService.collection(profilesCollection).deleteMany();
  });

  it("create creates a new private profile", async () => {
    const userObjectId = new ObjectId();
    const userId = userObjectId.toString();
    const repository = await runtime.runPromise(ProfilesRepository);
    await Effect.runPromise(repository.create(userId));
    const databaseService = await runtime.runPromise(DatabaseService);
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

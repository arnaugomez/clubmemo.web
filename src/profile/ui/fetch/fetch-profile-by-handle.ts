import * as Effect from "effect/Effect";
import { cache } from "react";
import { runServer } from "@/src/common/effect/server-runtime";
import { ProfilesRepository } from "@/src/profile/layers/layer_profiles-repository";

/**
 * Gets the data of the profile with the handle.
 *
 * The result is cached until the Server Components finish rendering.
 * @param handle The handle of the profile
 * @returns The profile with the handle
 */
export const fetchProfileByHandle = cache(async (handle: string) => {
  return runServer(
    Effect.gen(function* () {
      const profilesRepository = yield* ProfilesRepository;
      return yield* profilesRepository.getByHandle(handle);
    }),
  );
});

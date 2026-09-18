import * as Effect from "effect/Effect";
import { cache } from "react";
import { runServer } from "@/src/common/effect/server-runtime";
import { GetMyProfileUseCaseService } from "@/src/profile/layers/layer_get-my-profile-use-case";

/**
 * Obtains the data of the profile of the currently logged in user.
 * This function caches the result until the Server Components
 * finish rendering
 */
export const fetchMyProfile = cache(async () => {
  return runServer(
    Effect.gen(function* () {
      const useCase = yield* GetMyProfileUseCaseService;
      return yield* useCase.execute();
    }),
  );
});

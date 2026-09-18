import * as Effect from "effect/Effect";
import { cache } from "react";
import { GetSessionUseCaseService } from "@/src/auth/layers/layer_get-session-use-case";
import { runServer } from "@/src/common/effect/server-runtime";

/**
 * Obtains the current session of the user.
 *
 * The result is cached. The cache only lasts for the duration of the
 * React Server Components request.
 */
export const fetchSession = cache(async () => {
  return runServer(
    Effect.gen(function* () {
      const useCase = yield* GetSessionUseCaseService;
      return yield* useCase.execute();
    }),
  );
});

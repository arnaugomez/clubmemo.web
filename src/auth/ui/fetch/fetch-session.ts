import { cache } from "react";
import { authLocator } from "../../auth-locator";

/**
 * Obtains the current session of the user.
 *
 * The result is cached. The cache only lasts for the duration of the
 * React Server Components request.
 */
export const fetchSession = cache(async () => {
  const useCase = authLocator.GetSessionUseCase();
  return await useCase.execute();
});

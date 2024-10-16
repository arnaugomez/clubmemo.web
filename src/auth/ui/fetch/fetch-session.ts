import { cache } from "react";
import { locator_auth_GetSessionUseCase } from "../../locators/locator_get-session-use-case";

/**
 * Obtains the current session of the user.
 *
 * The result is cached. The cache only lasts for the duration of the
 * React Server Components request.
 */
export const fetchSession = cache(async () => {
  const useCase = locator_auth_GetSessionUseCase();
  return await useCase.execute();
});

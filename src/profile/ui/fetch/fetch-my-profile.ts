import { cache } from "react";
import { locator_profile_GetMyProfileUseCase } from "../../locators/locator_get-my-profile-use-case";

/**
 * Obtains the data of the profile of the currently logged in user.
 * This function caches the result until the Server Components
 * finish rendering
 */
export const fetchMyProfile = cache(async () => {
  const useCase = locator_profile_GetMyProfileUseCase();
  return await useCase.execute();
});

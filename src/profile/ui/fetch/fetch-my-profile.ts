import { cache } from "react";
import { profileLocator } from "../../profile-locator";

/**
 * Obtains the data of the profile of the currently logged in user.
 * This function caches the result until the Server Components
 * finish rendering
 */
export const fetchMyProfile = cache(async () => {
  const useCase = await profileLocator.GetMyProfileUseCase();
  return await useCase.execute();
});

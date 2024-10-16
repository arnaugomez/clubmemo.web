import { cache } from "react";
import { locator_profiles_ProfilesRepository } from "../../locators/locator_profiles-repository";

/**
 * Gets the data of the profile with the handle.
 *
 * The result is cached until the Server Components finish rendering.
 * @param handle The handle of the profile
 * @returns The profile with the handle
 */
export const fetchProfileByHandle = cache(async (handle: string) => {
  const profilesRepository = locator_profiles_ProfilesRepository();
  return profilesRepository.getByHandle(handle);
});

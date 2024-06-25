import { locator } from "@/src/common/di/locator";
import { cache } from "react";

/**
 * Gets the data of the profile with the handle.
 *
 * The result is cached until the Server Components finish rendering.
 * @param handle The handle of the profile
 * @returns The profile with the handle
 */
export const fetchProfileByHandle = cache(async (handle: string) => {
  const profilesRepository = await locator.ProfilesRepository();
  return profilesRepository.getByHandle(handle);
});

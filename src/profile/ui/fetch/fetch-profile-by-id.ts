import { locator } from "@/src/common/di/locator";
import { cache } from "react";

/**
 * Gets the data of the profile with the id.
 *
 * The result is cached until the Server Components finish rendering.
 * @param handle The id of the profile
 * @returns The profile with the id that matches the `id` parameter
 */
export const fetchProfileById = cache(async (id: string) => {
  const profilesRepository = await locator.ProfilesRepository();
  return profilesRepository.get(id);
});
